// models/Student.js
import mongoose from "mongoose";

const studentSchema = mongoose.Schema(
  {
    admissionNo: {
      type: Number,
    },
    aggregate: {
      type: Number,
    },
    completed: { type: Boolean, default: false },
    hasPaid: { type: Boolean, default: false },
    dateOfBirth: {
      type: String,
    },
    otherNames: {
      type: String,
      required: true,
    },
    gender: { type: String, enum: ["Male", "Female"], required: true },
    indexNumber: {
      type: String,
      required: true,
      unique: true,
    },
    jhsAttended: {
      type: String,
    },
    surname: {
      type: String,
      required: true,
    },
    smsContact: {
      type: String,
    },
    status: {
      type: String,
      enum: ["Day", "Boarding"],
    },
    year: {
      type: String,
    },
    rawScore: {
      type: String,
    },
    enrollmentCode: {
      type: String,
    },
    enrollmentForm: {
      type: String,
    },
    jhsType: {
      type: String,
    },
    photo: {
      type: String,
    },
    placeOfBirth: {
      type: String,
    },
    dateOfBirth: {
      type: Date,
    },
    nationality: {
      type: String,
    },
    religion: {
      type: String,
    },
    religiousDenomination: {
      type: String,
    },
    permanentAddress: {
      type: String,
    },
    region: {
      type: String,
    },
    district: {
      type: String,
    },
    interest: {
      type: String,
    },
    ghanaCardNumber: {
      type: String,
    },
    nHISNumber: {
      type: String,
    },
    mobilePhone: {
      type: String,
    },
    whatsappNumber: {
      type: String,
    },
    email: {
      type: String,
    },
    fathersName: {
      type: String,
    },
    fathersOccupation: {
      type: String,
    },
    mothersName: {
      type: String,
    },
    mothersOccupation: {
      type: String,
    },
    guardian: {
      type: String,
    },
    residentialTelephone: {
      type: String,
    },
    digitalAddress: {
      type: String,
    },
    house: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "House",
    },
    program: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Program",
    },
  },
  {
    timestamps: true,
  }
);

const Student = mongoose.model("Student", studentSchema);

export default Student;
