import express from "express";
const router = express.Router();

import { getUserInfo, registerUser, authUser } from "../controllers/userController.js";
import { extractDataFromWord } from "../controllers/parserController.js"; 
import { authUserMiddleware, authAdminMiddleware } from "../middleware/authMiddleware.js";

router.get('/', authUserMiddleware, getUserInfo);
router.post('/register', registerUser);
router.post('/login', authUser);
router.post('/parsedata', extractDataFromWord);

export default router;