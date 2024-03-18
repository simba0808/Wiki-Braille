
import express from "express";
const router = express.Router();
import { 
  uploadDocx, 
  extractImagesFromDoc,
  closeDocument,
  generateDescriptions,
} from "../controllers/officeController.js";
import imageUpload from "../middleware/imageUploadMiddleware.js";

router.post('/uploaddoc', imageUpload.single("doc"), uploadDocx);
router.post('/extractimages', extractImagesFromDoc);
router.post('/closedocument', closeDocument);
router.post('/generatedescription', generateDescriptions);

export default router;