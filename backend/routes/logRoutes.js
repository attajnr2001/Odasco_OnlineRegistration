// routes/logRoutes.js
import express from "express";
import {
  getLogItems,
  createLogItem,
  createPublicLogItem,
} from "../controllers/logController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/").get(getLogItems).post(protect, createLogItem);
router.post("/public", createPublicLogItem);

export default router;
