import { getAllBlogs, addNewBlog, deleteBlog } from "../controllers/blogController.js";
import imageUpload from "../middleware/imageUploadMiddleware.js";

import express from "express";
const router = express.Router();

router.get("/", getAllBlogs);
router.post("/add", imageUpload.single("image"), addNewBlog);
router.delete("/:id", deleteBlog);

export default router;