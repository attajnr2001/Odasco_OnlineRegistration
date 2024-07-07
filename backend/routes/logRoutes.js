// routes/galleryRoutes.js
import express from "express";
import { getLogItems, createLogItem } from "../controllers/logController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/").get(getLogItems).post(protect, createLogItem);

export default router;
