
import express from "express";
const router = express.Router();
import { 
  uploadDocx, 
  extractImagesFromDoc,
  closeDocument,
  generateDescriptions,
  getPrompts,
  savePrompt,
  saveDescription,
} from "../controllers/officeController.js";
import imageUpload from "../middleware/imageUploadMiddleware.js";

router.post('/uploaddoc', imageUpload.single("doc"), uploadDocx);
router.post('/extractimages', extractImagesFromDoc);
router.post('/closedocument', closeDocument);
router.post('/generatedescription', generateDescriptions);
router.post('/saveprompt', savePrompt);
router.post('/getprompts', getPrompts);
router.post('/savedescription', saveDescription);

export default router;