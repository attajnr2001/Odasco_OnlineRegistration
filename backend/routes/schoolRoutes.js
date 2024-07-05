// routes/galleryRoutes.js
import express from "express";
import {
  getSchoolItems,
  createSchoolItem,
  updateSchoolItem,
  deleteSchoolItem,
} from "../controllers/schoolController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/").get(getSchoolItems).post(protect, createSchoolItem);
router
  .route("/:id")
  .put(protect, updateSchoolItem)
  .delete(protect, deleteSchoolItem);

export default router;
