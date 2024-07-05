// models/House.js
import mongoose from "mongoose";

const houseSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    bedCapacity: {
      type: Number,
      required: true,
    },
    noOfStudents: {
      type: Number,
      required: true,
      default: 0, 
    },
    gender: {
      type: String, 
      required: true,
      enum: ["Male", "Female"],
    },
  },
  {
    timestamps: true,
  }
);

const House = mongoose.model("House", houseSchema);

export default House;
