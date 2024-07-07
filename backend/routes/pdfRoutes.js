// routes/pdfRoutes.js
import express from "express";
import { generateAdmissionLetter } from "../controllers/pdfController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/generate-admission-letter", protect, generateAdmissionLetter);

export default router;
