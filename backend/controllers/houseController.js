// controllers/houseController.js
import asyncHandler from "express-async-handler";
import House from "../models/House.js";

// @desc    Get all house items
// @route   GET /api/house
// @access  Public
const getHouseItems = asyncHandler(async (req, res) => {
  const houseItems = await House.find({});
  res.json(houseItems);
});

// @desc    Create a new house item
// @route   POST /api/house
// @access  Private
const createHouseItem = asyncHandler(async (req, res) => {
  const { name, bedCapacity, noOfStudents, gender } = req.body;
  const houseItem = await House.create({
    name,
    bedCapacity,
    noOfStudents,
    gender,
  });

  if (houseItem) {
    res.status(201).json(houseItem); 
  } else {
    res.status(400); 
    throw new Error("Invalid house item data");
  }
});

// @desc    Update a house item
// @route   PUT /api/house/:id
// @access  Private 
const updateHouseItem = asyncHandler(async (req, res) => {
  const { name, bedCapacity, noOfStudents, gender } = req.body;

  const houseItem = await House.findById(req.params.id);

  if (houseItem) {
    houseItem.name = name || houseItem.name;
    houseItem.bedCapacity = bedCapacity || houseItem.bedCapacity;
    houseItem.noOfStudents = noOfStudents || houseItem.noOfStudents;
    houseItem.gender = gender || houseItem.gender;

    const updatedHouseItem = await houseItem.save();
    res.json(updatedHouseItem);
  } else {
    res.status(404);
    throw new Error("House item not found");
  }
});

// @desc    Delete a house item
// @route   DELETE /api/house/:id
// @access  Private
const deleteHouseItem = asyncHandler(async (req, res) => {
  try {
    const houseItem = await House.findById(req.params.id);

    if (houseItem) {
      await House.deleteOne({ _id: req.params.id });
      res.json({ message: "House item removed" });
    } else {
      res.status(404);
      throw new Error("House item not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export { getHouseItems, createHouseItem, updateHouseItem, deleteHouseItem };
 