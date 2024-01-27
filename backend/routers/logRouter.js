import { getLogs, generateLog } from "../controllers/logController.js";
import express from "express";
const router = express.Router();

router.post("/getlogs", getLogs);
router.post("/createlogs", generateLog);

export default router;