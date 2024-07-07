// routes/studentRoutes.js
import express from "express";
import {
  getStudentItems,
  createStudentItem,
  updateStudentItem,
  deleteStudentItem,
  getRecentStudents,
  deleteUnregisteredStudents,
} from "../controllers/studentController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Place these routes before the /:id route
router.route("/").get(getStudentItems).post(protect, createStudentItem);
router.get("/recent", getRecentStudents);
router.delete("/unregistered", protect, deleteUnregisteredStudents);

router
  .route("/:id")
  .put(protect, updateStudentItem)
  .delete(protect, deleteStudentItem);

export default router;
