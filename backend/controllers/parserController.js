import { parse } from "node-html-parser";
import fs from "fs";
import iconv from "iconv-lite";

const extractDataFromWord = async (req, res) => {
  
  const path = req.body.filePath;
  const type = req.body.type;
  console.log(path);
  
  const buffer = fs.readFileSync(path);

  const decodedData = iconv.decode(buffer, "iso-8859-1");
  const root = parse(decodedData).text;
  //const root = parse(data).text;
    //console.log(root);
    const titleMatch = root.match(/Título: (.+)/g);
    if(titleMatch) {
      const titles = titleMatch.map((title) => 
        title.replace("Título: ", "")
      );
      const title = titles.map((item) => item.match(/<\/span><\/h\d>/g) ? item.replace(/<\/span><\/h\d>/g, ""): item);
      // const result = titles.match(/<\/span><\/h\d>/g);
      // if(result) {
      //   const title = result.map((item) => item.replace(/<\/span><\/h\d>/g, ""));
      //   console.log(title)
      // }
      console.log(title)
    }
    
    const catagoryMatch = root.match(/Categoria: (.+)/g);
    if(catagoryMatch) {
      const tempCatagories = catagoryMatch.map((catagory) => catagory.replace("Categoria: ", ""));
      const catagories = tempCatagories.map((catagory) => catagory.match(/<\/span><\/h\d>/g) ? catagory.replace(/<\/span><\/h\d>/g, ""): catagory);
      console.log(catagories);
    }

    if(type === "text") {
      const descriptionMatch = root.match(/_y[0-9][0-9]: (.+)/g);
      if(descriptionMatch) {
        const descriptions = descriptionMatch.map((description) => description.replace(/_y[0-9][0-9]: /,""));
        console.log(descriptions)
      }
    } else if(type === "braille") {
      console.log("enter")
      const descriptionMatch = root.match(/<f->([\s\S]+?)<f\+>/);
      if(descriptionMatch) {
        console.log("FFFFF")
        console.log(descriptionMatch, descriptionMatch.length);
      }
    }
  // fs.readFile(path, (err, data) => {
  //   if(err) throw err;
  //   const zip = new PizZip();
  //   zip.file(data);
  //   const doc = new Docxtemplater();
  //   doc.loadZip(zip)
  //   console.log('2')
  // })
  // const imageModule = new ImageModule({centered: false});

  // doc.attachModule(imageModule);
  // doc.render();
  // console.log('2')
  // const images = imageModule.imageNumber;
  // console.log(images)
  // mammoth.extractRawText({ path })
  //   .then(result => {
  //     console.log(result)
  //     const texts = result.value;
  //     texts.split("Título").map((text, index) => {
  //       text = "Título"+text;
  //       const title = text.match(/Título: (.+)/) ? text.match(/Título: (.+)/)[1]: "";
  //       const catagory = text.match(/Categoria: (.+)/) ? text.match(/Categoria: (.+)/)[1]:"";
  //       const description = text.match(/<f->([\s\S]+?)<f\+>/) ? text.match(/<f->([\s\S]+?)<f\+>/)[0]:"";
  //     });
  //     console.log(result.messages)
  //     const images = result.messages.filter(message => message.type === "image");
  //     console.log('>>>>', images.length)
  //     images.forEach((image, index) => {
  //       const { contentType, content } = image;
  //       const extension = contentType.split("/")[1];
  //       console.log(`image_${index}.${extension}`)
  //       fs.writeFileSync(`image_${index}.${extension}`, content, 'binary');
  //     });
      
  //     mammoth.images.imgElement(function(image) {
  //       console.log("dddddddddddddddddddd")
  //       return image.read("base64").then(function(buffer) {
  //         console.log("dddddddddddddddddddd")
  //         console.log(buffer);
  //       })
  //     })
  //     // const titleMatch = item.match(/Título: (.+)/);
  //     // const title = titleMatch ? titleMatch[1] : "";
  //     // console.log(titleMatch);

  //     // texts.match(/Título: (.+)/).map((item, index) => {
  //     //   console.log(index, item);
  //     // });
  //     // texts.match(/Categoria: (.+)/).map((item, index) => {
  //     //   console.log(index, item);
  //     // })
  //   })
  //   .catch(err => {
  //     console.error(err);
  //   })
};

export {
  extractDataFromWord,
};
