// routes/galleryRoutes.js
import express from "express";
import {
  getProgramItems,
  createProgramItem,
  updateProgramItem,
  deleteProgramItem,
} from "../controllers/programController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/").get(getProgramItems).post(protect, createProgramItem);
router
  .route("/:id")
  .put(protect, updateProgramItem)
  .delete(protect, deleteProgramItem);

export default router;
