import jszip from "jszip";
import fs from "fs";
import mammoth from "mammoth";

const extractDataFromWord = async (req, res, next) => {
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
        req.images = images;
        req.dataSet = dataSet;
        next();
      } catch (err) {
        res.status(405);
        throw new Error("Error occured while parsing Doc")
      }
    })
    .catch(err => {
      res.status(405);
      throw new Error("Error occured while extracting text from Doc");
    })
};

export default extractDataFromWord;