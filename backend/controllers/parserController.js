import jszip from "jszip";
import fs from "fs";
import mammoth from "mammoth";
import Data from "../models/data.js";
import sharp from "sharp";
import path from "path";

const extractDataFromWord = async (req, res) => {
  mammoth.extractRawText({ path: req.file.path })
    .then(async (result) => {
      const root = result.value;  
      let dataSet = [];

      try {
        const paragraphs = root.split(/(?=^Título:)/gm);

        paragraphs.forEach(async (paragraph, index) => {
          let title = paragraph.match(/Título:(.+)/g);
          if(title !== null) {
            let catagory, tag, description;
            catagory = paragraph.match(/Categoria:(.+)/g);
            tag = paragraph.match(/Tag([\s\S]*?):(.+)/g);

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
              comments: [],
            });
          }
        });

        const zip = await jszip.loadAsync(fs.readFileSync(req.file.path));
        const originImages = zip.file(/\.png|\.jpeg|\.jpg|\.gif|\.emf|\.wmf/i);
        const images = originImages.filter((item) => !item.name.includes("thumbnail"));

        if(images.length !==  dataSet.length) {
          deleteUploadedFile(req.file.path);
          res.status(203).send("invalid doc");
        } else {
          let invalidImages = [];
          images.map((image) => {
            const originName = image.name.split("/").pop();
            
            if(originName.split(".")[1] === "emf" || originName.split(".")[1] === "wmf") {
              invalidImages.push({
                title: dataSet[parseInt(originName.match(/\d+/)[0])-1].title,
                order: originName.match(/\d+/)[0]
              });
            }
          });

          if(invalidImages.length !== 0) {
            invalidImages.sort((a, b) => a.order - b.order);
            res.status(203).send({
              message: "invalid image",
              data: invalidImages,
            });
            deleteUploadedFile(req.file.path);
            return;
          }
          
          fs.access("./images", (error) => {
            if (error) {
              fs.mkdirSync("./images");
            }
          });

          for(let i = 0; i < images.length; i++) {
            const image = images[i];
            const orignalName = image.name.split('/').pop();
            const index = parseInt(orignalName.match(/\d+/));
            const content = await image.async("nodebuffer");
            const timeStamp = new Date().toISOString().replace(/[-T:Z.]/g, '');
            await sharp(content).webp({ quality: 20 }).toFile("./images/" + `${timeStamp}-${orignalName}`);
            dataSet[index-1].image = `${timeStamp}-${orignalName}`;
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
              data: dataSet.length
            });
            deleteUploadedFile(req.file.path);
          } catch (err) {
            deleteUploadedFile(req.file.path);
            res.status(400).send("Error occured while saving Doc");
          }
        }
      } catch (err) {
        deleteUploadedFile(req.file.path);
        res.status(400).send("Error occured while parsing Doc");
      }
    })
    .catch(err => {
      deleteUploadedFile(req.file.path);
      res.status(400).send("Error occured while extracting text from Doc");
    })
};

const deleteUploadedFile = async (path) => {
  fs.unlink(path, (err) => {
    if(err) {
      console.log(err);
      res.status(500);
      throw new Error("");
    }
  });
};

export {
  extractDataFromWord,
};