import mammoth from "mammoth";
import Docxtemplater from "docxtemplater";
import fs from 'fs';
import ImageModule from "docxtemplater-image-module";
import JSZip from 'jszip';
import PizZip from "pizzip";

const extractDataFromWord = async (req, res) => {
  
  const path = req.body.filePath;
  console.log(path)
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
