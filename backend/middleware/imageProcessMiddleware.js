import multer from "multer";
import { GridFsStorage } from "multer-gridfs-storage";
import dotenv from "dotenv";
dotenv.config();

const storage = new GridFsStorage({
  url: process.env.MONGO_URI,
  file: (req) => {
    return {
      bucketName: 'images',
      filename: `${Date.now()}-${req.images[0].name}`,
      file: req.images[0],
    };
  },
});

const upload = (multer({storage}));

export default upload.single("file");