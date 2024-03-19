import jszip from "jszip";
import fs from "fs";
import sharp from "sharp";
import OpenAI from "openai";

import Prompt from "../models/prompt.js";
import Data from "../models/data.js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

const uploadDocx = async (req, res) => {
  console.log(req.file.filename)
  res.status(200).send({
    filename: req.file.filename,
    path: req.file.path
  });
}

const extractImagesFromDoc = async (req, res) => {
  const zip = await jszip.loadAsync(fs.readFileSync(req.body.path));
  const originImages = zip.file(/\.png|\.jpeg|\.jpg|\.gif|\.emf|\.wmf/i);
  const images = originImages.filter((item) => !item.name.includes("thumbnail"));
  const imagePaths = [];

  for (let i = 0; i < images.length; i++) {
    const orignalName = images[i].name.split('/').pop();
    const content = await images[i].async("nodebuffer");
    const timeStamp = new Date().toISOString().replace(/[-T:Z.]/g, '');
    await sharp(content).webp({ quality: 20 }).toFile(`./images/blog/${timeStamp}-${orignalName}`);
    imagePaths[i] = `${timeStamp}-${orignalName}`;
  }

  res.status(200).send(imagePaths);
}

const generateDescriptions = async (req, res) => {
  const { promptText, image } = req.body;

  let base64Data;
  const imageStream = fs.createReadStream(`images/blog/${image}`);
  await new Promise((resolve, reject) => {
    imageStream.on("data", (data) => {
      base64Data = Buffer.from(data).toString("base64");
      resolve();
    });
    imageStream.on("error", (err) => {
      reject(err);
    })
  });

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: promptText,
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Data}`,
              }
            }
          ]
        },
      ],
      temperature: 0.6,
      max_tokens: 1024,
    });
    
    res.status(200).send({
      message: "success",
      data: response.choices[0].message.content
    });
  } catch (err) {
    res.status(500).send({
      message: "failed"
    });
  }
};

const closeDocument = async (req, res) => {
  const { documentPath, imagePath } = req.body;

  fs.rename(`images/${documentPath}`, (err) => {
    if (err) {
      console.log(err);
      res.status(500);
      throw new Error("Failed to delete document");
    }
  });
  imagePath.map((image) => {
    fs.unlink(`images/blog/${image}`, (err) => {
      console.log(err);
      if (err) {
        console.log(err);
        res.status(500);
        throw new Error("Failed to delete document");
      }
    })
  });

  res.status(200).send("success");
}

const getPrompts = async (req, res) => {
  const { email } = req.body;
  try {
    const promptObjects = await Prompt.find({
      user: email
    });
    let prompts = [];
    promptObjects.map((item) => {
      prompts.push(item.text)
    });
    res.status(200).send({
      prompts
    })
  } catch(err) {
    res.status(500);
    throw new Error("Failed to fetch prompts");
  }
}

const savePrompt = async (req, res) => {
  const { email, promptText } = req.body;
  try {
    const newPrompt = await Prompt.create({
      text: promptText,
      user: email
    });
    res.status(200).send({
      message: "success"
    })
  } catch(err) {
    res.status(500);
    throw new Error("Failed to save prompt");
  }
}

const saveDescription = async (req, res) => {
  const { description } = req.body;
  try {
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
    
    fs.rename(`images/blog/${description.image}`, `images/${description.image}`, async (err) => {
      if(err) {
        console.log(err);
      } else {
        const desc = await Data.create({
          title_id: (start_index+1).toString().padStart(6, "0"),
          title: description.title,
          catagory: description.category,
          description: description.newDescription,
          image: description.image
        });
      }
    });

    res.status(200).send({
      message: "success"
    });
  } catch(err) {
    res.status(500);
    throw new Error("Failed to save description");
  }
}

export {
  uploadDocx,
  extractImagesFromDoc,
  closeDocument,
  generateDescriptions,
  getPrompts,
  savePrompt,
  saveDescription,
}