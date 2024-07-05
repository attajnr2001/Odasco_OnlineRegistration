import express from "express";
import {
  authClient,
  logoutClient,
  updatePaymentStatus,
  getStudentDetails,
} from "../controllers/clientController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/auth", authClient);
router.post("/logout", logoutClient);
router.post("/update-payment", protect, updatePaymentStatus);
router.route("/:id").get(getStudentDetails);

export default router;
