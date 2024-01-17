import jszip from "jszip";
import fs from "fs";
import mammoth from "mammoth";
import Data from "../models/data.js";
import sharp from "sharp";

const extractDataFromWord = async (req, res) => {
  console.log(Date.now())
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
              description = description.replace(/\n\n/gm, "\n");
            } else {
              description = paragraph.replace(title, "").replace(catagory, "").trim();
            }

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
        const images = zip.file(/\.png|\.jpeg|\.jpg|\.gif|\.emf/i);

        fs.access("./images", (error) => {
          if (error) {
            fs.mkdirSync("./images");
          }
        });

        for(let i = 0; i < images.length; i++) {
          const image = images[i];
          const orignalName = image.name.split('/')[2];
          //const contentType = `image/${orignalName.split('.')[1]}`;
          const content = await image.async("nodebuffer");
          //fs.writeFileSync(`./images/${orignalName}`, content, "base64");

          // const imageModel = await ImageModel.create({
          //   orignalName,
          //   content,
          //   contentType,
          // });
          //dataSet[i].image = imageModel._id;
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
              return;
            }
          });
        } catch (err) {
          console.log(err);
          res.status(403);
          throw new Error("Error occured while saving Doc");
        }
      } catch (err) {
        console.log(err);
        res.status(403);
        throw new Error("Error occured while parsing Doc")
      }
    })
    .catch(err => {
      console.error(err);
      res.status(405);
      throw new Error("Error occured while extracting text from Doc");
    })
};

export {
  extractDataFromWord,
};
