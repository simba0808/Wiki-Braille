import { searchData, getFilteredNumber, updateDescription, getDescriptionImages } from "../controllers/searchController.js";

import { authAdminMiddleware } from "../middleware/authMiddleware.js";
import { extractDataFromWord } from "../controllers/parserController.js";
import express from "express";
const router = express.Router();
import multer from "multer";
const upload = multer({dest: "uploads/"});

router.post('/parsedata', upload.single("file"), extractDataFromWord);
router.post('/totalnumber', getFilteredNumber);
router.post('/getdata', searchData);
router.post('/getImage', getDescriptionImages);
router.post('/edit', authAdminMiddleware, updateDescription);

export default router;