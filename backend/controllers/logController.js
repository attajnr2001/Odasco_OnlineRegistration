// controllers/logController.js
import asyncHandler from "express-async-handler";
import Log from "../models/Log.js";

// @desc    Get all house items
// @route   GET /api/house
// @access  Public
const getLogItems = asyncHandler(async (req, res) => {
  const logItems = await Log.find({});
  res.json(logItems);
});

const createLogItem = asyncHandler(async (req, res) => {
  const { action, user, locationIP } = req.body;

  const logItem = await Log.create({
    action,
    user,
    locationIP,
  });

  if (logItem) {
    res.status(201).json(logItem);
  } else {
    res.status(400);
    throw new Error("Invalid log data");
  }
});

export { getLogItems, createLogItem };
