import { getAllBlogs, addNewBlog, selectBlog, updateBlog, deleteBlog } from "../controllers/blogController.js";
import { authUserMiddleware, authAdminMiddleware } from "../middleware/authMiddleware.js";
import express from "express";
const router = express.Router();

router.get("/", authUserMiddleware, getAllBlogs);
router.post("/add", authAdminMiddleware, addNewBlog);
router.post("/", selectBlog);
router.post("/update", authAdminMiddleware, updateBlog);
router.delete("/:id", authAdminMiddleware, deleteBlog);

export default router;