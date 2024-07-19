// models/School.js
import mongoose from "mongoose";

const schoolSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    shortName: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    headMasterName: {
      type: String,
      required: true,
    },
    box: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    helpDeskNo: {
      type: Number,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    senderID: {
      type: String,
      required: true,
    },
    admissionOpeningDateTime: {
      type: Date,
      required: true,
    },
    schOpeningDateTime: {
      type: Date,
      required: true,
    },
    academicYear: {
      type: String,
      required: true,
    },
    acceptOnlinePayment: {
      type: Boolean,
      required: true,
    },
    serviceCharge: {
      type: Number,
      required: true,
    },
    allowUploadPictures: {
      type: Boolean,
      required: true,
      default: true,
    },
    autoStudentHousing: {
      type: Boolean,
      required: true,
      default: true,
    },
    allowStudentClassSelection: {
      type: Boolean,
      required: true,
      default: false,
    },
    admissionStatus: {
      type: Boolean,
      required: true,
    },
    announcement: {
      type: [String],
      default: [],
    },
    showMedicalUndertaking: {
      type: Boolean,
      default: false,
    },
    showProgramSubject: {
      type: Boolean,
      default: false,
    },
    personalRecordsCaption: {
      type: String,
    },
    undertakingMedicalCaption: {
      type: String,
    },
    programSubjectCaption: {
      type: String,
    },
    notes: {
      type: String,
    },
    prospectus: {
      type: String,
    },
    undertaking: {
      type: String,
    },
    logo: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const School = mongoose.model("School", schoolSchema);

export default School;
