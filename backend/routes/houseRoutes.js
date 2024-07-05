// routes/galleryRoutes.js
import express from "express";
import {
  getHouseItems,
  createHouseItem,
  updateHouseItem,
  deleteHouseItem,
} from "../controllers/houseController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/").get(getHouseItems).post(protect, createHouseItem);
router
  .route("/:id")
  .put(protect, updateHouseItem)
  .delete(protect, deleteHouseItem);

export default router;
