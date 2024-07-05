// clientController
import asyncHandler from "express-async-handler";
import Student from "../models/Student.js";
import generateToken from "../utils/generateToken.js";

const authClient = asyncHandler(async (req, res) => {
  console.log("authClient called");

  const { indexNumber } = req.body;
  const student = await Student.findOne({ indexNumber });

  if (student) {
    generateToken(res, student._id);
    res.json({
      _id: student._id,
      otherNames: student.otherNames,
      indexNumber: student.indexNumber,
      surname: student.surname,
      hasPaid: student.hasPaid,
      completed: student.completed,
    });
  } else {
    res.status(401);
    throw new Error("Invalid index Number");
  }
});

const logoutClient = (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logged out successfully" });
};

const updatePaymentStatus = asyncHandler(async (req, res) => {
  const { studentId } = req.body;

  const student = await Student.findById(studentId);

  if (student) {
    student.hasPaid = true;
    const updatedStudent = await student.save();

    res.json({
      _id: updatedStudent._id,
      otherNames: updatedStudent.otherNames,
      indexNumber: updatedStudent.indexNumber,
      surname: updatedStudent.surname,
      hasPaid: updatedStudent.hasPaid,
      completed: updatedStudent.completed,
    });
  } else {
    res.status(404);
    throw new Error("Student not found");
  }
});

const getStudentDetails = asyncHandler(async (req, res) => {
  console.log("getStudentDetails called with id:", req.params.id);
  const student = await Student.findById(req.params.id).select(
    "otherNames surname indexNumber gender admissionNo year completed program status house aggregate jhsAttended photo"
  );
  console.log("Found student:", student);
  if (student) {
    res.json(student);
  } else {
    res.status(404);
    throw new Error("Student not found");
  }
});
export { authClient, logoutClient, updatePaymentStatus, getStudentDetails };
