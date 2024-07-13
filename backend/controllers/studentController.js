// controllers/studentController.js
import asyncHandler from "express-async-handler";
import Student from "../models/Student.js";
import Program from "../models/Program.js";
import multer from "multer";
import path from "path";
import fs from 'fs';

// @desc    Get all student items
// @route   GET /api/student
// @access  Public
const getStudentItems = asyncHandler(async (req, res) => {
  const studentItems = await Student.find({});
  res.json(studentItems);
});

const getRecentStudents = asyncHandler(async (req, res) => {
  const mostRecent = await Student.findOne().sort("-createdAt");
  if (!mostRecent) {
    return res.json([]);
  }

  const mostRecentDate = new Date(mostRecent.createdAt);
  mostRecentDate.setHours(0, 0, 0, 0); // Set time to beginning of the day

  const nextDay = new Date(mostRecentDate);
  nextDay.setDate(nextDay.getDate() + 1);

  const recentStudents = await Student.find({
    createdAt: {
      $gte: mostRecentDate,
      $lt: nextDay,
    },
  }).sort("-createAt");

  res.json(recentStudents);
});

const getStudentCompletedItems = asyncHandler(async (req, res) => {
  const studentItems = await Student.find({ completed: false });
  res.json(studentItems);
});

// @desc Create a new student item
// @route POST /api/student
// @access  Private
const createStudentItem = asyncHandler(async (req, res) => {
  const {
    aggregate,
    dateOfBirth,
    otherNames,
    gender,
    indexNumber,
    jhsAttended,
    surname,
    smsContact,
    status,
    year,
    house,
    program,
  } = req.body;

  // Find the highest admissionNo
  const highestAdmissionNo = await Student.findOne({}, "admissionNo")
    .sort("-admissionNo")
    .limit(1);

  // Calculate the new admissionNo
  const newAdmissionNo = highestAdmissionNo
    ? highestAdmissionNo.admissionNo + 1
    : 1;

  const studentItem = await Student.create({
    admissionNo: newAdmissionNo,
    aggregate,
    dateOfBirth,
    otherNames,
    gender,
    indexNumber,
    jhsAttended,
    surname,
    smsContact,
    status,
    year,
    house,
    program,
  });

  if (studentItem) {
    // Update the program's noOfStudents
    await Program.findByIdAndUpdate(
      program,
      { $inc: { noOfStudents: 1 } },
      { new: true }
    );

    res.status(201).json(studentItem);
  } else {
    res.status(400);
    throw new Error("Invalid student item data");
  }
});

// @desc    Update a student item
// @route   PUT /api/student/:id
// @access  Private
const updateStudentItem = asyncHandler(async (req, res) => {
  const studentItem = await Student.findById(req.params.id);

  if (studentItem) {
    // List of all fields in the Student model
    const fields = [
      "admissionNo",
      "aggregate",
      "completed",
      "hasPaid",
      "dateOfBirth",
      "otherNames",
      "gender",
      "indexNumber",
      "jhsAttended",
      "surname",
      "smsContact",
      "status",
      "year",
      "rawScore",
      "enrollmentCode",
      "enrollmentForm",
      "jhsType",
      "photo",
      "town",
      "placeOfBirth",
      "nationality",
      "religion",
      "religiousDenomination",
      "permanentAddress",
      "region",
      "district",
      "interest",
      "ghanaCardNumber",
      "nHISNumber",
      "mobilePhone",
      "whatsappNumber",
      "email",
      "fathersName",
      "fathersOccupation",
      "mothersName",
      "mothersOccupation",
      "guardian",
      "residentialTelephone",
      "digitalAddress",
      "house",
      "program",
    ];

    // Update each field
    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        if (field === "dateOfBirth") {
          studentItem[field] = req.body[field]
            ? new Date(req.body[field])
            : null;
        } else if (["completed", "hasPaid"].includes(field)) {
          studentItem[field] = req.body[field] !== "" ? req.body[field] : false;
        } else if (["house", "program"].includes(field)) {
          studentItem[field] = req.body[field] || null;
        } else {
          studentItem[field] = req.body[field] || "";
        }
      }
    });

    const updatedStudentItem = await studentItem.save();
    res.json(updatedStudentItem);
  } else {
    res.status(404);
    throw new Error("Student item not found");
  }
});

const deleteStudentItem = asyncHandler(async (req, res) => {
  try {
    const studentItem = await Student.findById(req.params.id);

    if (studentItem) {
      await Student.deleteOne({ _id: req.params.id });
      res.json({ message: "Student item removed" });
    } else {
      res.status(404);
      throw new Error("Student item not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @desc    Delete all unregistered students
// @route   DELETE /api/students/unregistered
// @access  Private
const deleteUnregisteredStudents = asyncHandler(async (req, res) => {
  const result = await Student.deleteMany({ completed: false });

  if (result.deletedCount > 0) {
    res.json({
      message: `${result.deletedCount} unregistered students deleted`,
    });
  } else {
    res.status(404);
    throw new Error("No unregistered students found");
  }
});


export {
  getStudentItems,
  createStudentItem,
  updateStudentItem,
  deleteStudentItem,
  getRecentStudents,
  deleteUnregisteredStudents,
};