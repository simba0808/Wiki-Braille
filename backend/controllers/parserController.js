import jszip from "jszip";
import fs from "fs";
import mammoth from "mammoth";
import Data from "../models/data.js";
import sharp from "sharp";

const extractDataFromWord = async (req, res) => {
  mammoth.extractRawText({ path: req.file.path })
    .then(async (result) => {
      const root = result.value;  
      let dataSet = [];

      try {
        const paragraphs = root.split(/(?=^Título:)/gm);

        paragraphs.forEach(async (paragraph, index) => {
          let title = paragraph.match(/Título: (.+)/g);
          if(title !== null) {
            let catagory, tag, description;
            catagory = paragraph.match(/Categoria: (.+)/g);
            tag = paragraph.match(/Tag([\s\S]*?): (.+)/g);

            if(tag) {
              description = paragraph.replace(title, "").replace(catagory, "").replace(tag, "").trim();
            } else {
              description = paragraph.replace(title, "").replace(catagory, "").trim();
            }
            description = description.replace(/\n\n/gm, "\n");
            
            title = title[0].split(":")[1].trim();
            catagory = catagory[0].split(":")[1].trim();
            tag = tag ? tag[0].split(":")[1].trim() : "";

            dataSet.push({
              title,
              catagory,
              tag,
              description, 
              image: "",
            });
          }
        });

        const zip = await jszip.loadAsync(fs.readFileSync(req.file.path));
        const images = zip.file(/\.png|\.jpeg|\.jpg|\.gif/i);

        fs.access("./images", (error) => {
          if (error) {
            fs.mkdirSync("./images");
          }
        });

        if(images.length !==  dataSet.length) {
          res.status(400).send("Invalid Document");
        }
        else {
          for(let i = 0; i < images.length; i++) {
            const image = images[i];
            const orignalName = image.name.split('/')[2];
            const content = await image.async("nodebuffer");
            const timeStamp = new Date().toISOString().replace(/[-T:Z.]/g, '');
            await sharp(content).webp({ quality: 20 }).toFile("./images/" + `${timeStamp}-${orignalName}`);
            dataSet[i].image = `http://localhost:3000/${timeStamp}-${orignalName}`;
          }
  
          const document = await Data.aggregate([
            {
              $sort: { "title_id": -1 }
            }, 
            {
              $project: {
                "title_id": 1
              }
            },
            {
              $limit: 1
            }
          ]);    
          let start_index = 0;
          if(document.length > 0) {
            start_index = parseInt(document[0].title_id.replace(/^0+/, ""));
          } else {
            start_index = 0;
          }
  
          try {
            dataSet.forEach(async (item, index) => {
              item = {...item, title_id:  (start_index+index+1).toString().padStart(6, "0")};
              const data = await Data.create(item);
            });
            res.status(200).send({
              message: "success",
            });
            fs.unlink(req.file.path, (err) => {
              if(err) {
                console.log(err);
                res.status(500);
                throw new Error("")
              }
            });
          } catch (err) {
            res.status(400).send("Error occured while saving Doc");
          }
        }
      } catch (err) {
        res.status(400).send("Error occured while parsing Doc");
      }
    })
    .catch(err => {
      res.status(400).send("Error occured while extracting text from Doc");
    })
};

export {
  extractDataFromWord,
};
