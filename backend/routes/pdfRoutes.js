// routes/pdfRoutes.js
import express from "express";
import {
  generateAdmissionLetter,
  generatePersonalRecords,
} from "../controllers/pdfController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/generate-admission-letter", protect, generateAdmissionLetter);
router.post("/generate-personal-records", protect, generatePersonalRecords); 

export default router;
