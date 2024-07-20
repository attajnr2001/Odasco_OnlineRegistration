// controllers/galleryController.js
import asyncHandler from "express-async-handler";
import Program from "../models/Program.js";

// @desc    Get all program items
// @route   GET /api/program
// @access  Public
const getProgramItems = asyncHandler(async (req, res) => {
  const programItems = await Program.find({});
  res.json(programItems);
});

// @desc    Create a new program item
// @route   POST /api/program
// @access  Private
const createProgramItem = asyncHandler(async (req, res) => {
  const { name, programID, noOfStudents, shortName } = req.body;
  res.send(req.body);
  console.log(req.body);

  if (!programID) {
    res.status(400);
    throw new Error("Program ID (programID) is required");
  }

  const programItem = await Program.create({
    name,
    programID,
    noOfStudents,
    shortName,
  });

  if (programItem) {
    res.status(201).json(programItem);
  } else {
    res.status(400);
    throw new Error("Invalid program item data");
  }
});

// @desc    Update a program item
// @route   PUT /api/program/:id
// @access  Private
const updateProgramItem = asyncHandler(async (req, res) => {
  const { name, programID, noOfStudents, shortName } = req.body;

  const programItem = await Program.findById(req.params.id);

  if (programItem) {
    programItem.name = name || programItem.name;
    programItem.programID = programID || programItem.programID;
    programItem.noOfStudents = noOfStudents || programItem.noOfStudents;
    programItem.shortName = shortName || programItem.shortName;

    const updatedProgramItem = await programItem.save();
    res.json(updatedProgramItem);
  } else {
    res.status(404);
    throw new Error("Program item not found");
  }
});

// @desc    Delete a program item
// @route   DELETE /api/program/:id
// @access  Private
const deleteProgramItem = asyncHandler(async (req, res) => {
  try {
    const programItem = await Program.findById(req.params.id);

    if (programItem) {
      await Program.deleteOne({ _id: req.params.id });
      res.json({ message: "Program item removed" });
    } else {
      res.status(404);
      throw new Error("Program item not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export {
  getProgramItems,
  createProgramItem,
  updateProgramItem,
  deleteProgramItem,
};
