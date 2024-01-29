import { getAllBlogs, addNewBlog, selectBlog, updateBlog, deleteBlog } from "../controllers/blogController.js";
import imageUpload from "../middleware/imageUploadMiddleware.js";

import express from "express";
const router = express.Router();

router.get("/", getAllBlogs);
router.post("/add", imageUpload.single("image"), addNewBlog);
router.post("/", selectBlog);
router.post("/update", updateBlog);
router.delete("/:id", deleteBlog);

export default router;