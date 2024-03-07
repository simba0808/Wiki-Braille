import { 
  searchData, 
  updateDescription, 
  updateImageDescription,
  rateDescription,
  deleteComment,
  deleteDescription,
  deleteDescriptionWithBatch
} from "../controllers/searchController.js";
import { extractDataFromWord } from "../controllers/parserController.js";
import { authEditMiddleware } from "../middleware/authMiddleware.js";
import express from "express";
const router = express.Router();

import imageUpload from "../middleware/imageUploadMiddleware.js";
import multer from "multer";
const upload = multer({dest: "uploads/"});


router.post('/parsedata', upload.single("file"), extractDataFromWord);
router.post('/getdata', searchData);
router.post('/edit', authEditMiddleware,  updateDescription);
router.post('/editimage', authEditMiddleware, imageUpload.single("image"), updateImageDescription);
router.post('/rate', rateDescription);
router.post('/deletecomment', authEditMiddleware, deleteComment);
router.post('/delete/:id', authEditMiddleware, deleteDescription);
router.post('/batchdelete', authEditMiddleware, deleteDescriptionWithBatch);

export default router;