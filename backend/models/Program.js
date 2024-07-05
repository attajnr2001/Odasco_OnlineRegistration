// models/Program.js
import mongoose from "mongoose";

const ProgramSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    programID: {
      type: String,
      required: true,
      unique: true,
    },
    noOfStudents: {
      type: Number,  
      required: true,
      default: 0,
    },
    shortName: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

const Program = mongoose.model("Program", ProgramSchema);
export default Program;
