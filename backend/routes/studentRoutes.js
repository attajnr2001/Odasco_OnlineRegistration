// routes/galleryRoutes.js
import express from "express";
import {
  getStudentItems,
  createStudentItem,
  updateStudentItem,
  deleteStudentItem,
} from "../controllers/studentController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/").get(getStudentItems).post(protect, createStudentItem);
router
  .route("/:id")
  .put(protect, updateStudentItem)
  .delete(protect, deleteStudentItem);

export default router;
