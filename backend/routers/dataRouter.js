import { searchData, getFilteredNumber, updateDescription } from "../controllers/searchController.js";

import { authEditMiddleware } from "../middleware/authMiddleware.js";
import { extractDataFromWord, uploadFile } from "../controllers/parserController.js";
import express from "express";
const router = express.Router();
import multer from "multer";
const upload = multer({dest: "uploads/"});

router.post('/parsedata', upload.single("file"), extractDataFromWord);
router.post('/totalnumber', getFilteredNumber);
router.post('/getdata', searchData);
router.post('/edit', authEditMiddleware, updateDescription);
router.post('/upload', upload.single("file"), uploadFile);

export default router;