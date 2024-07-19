import mongoose from "mongoose";

const logSchema = mongoose.Schema(
  {
    action: {
      type: String,
      required: true, 
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    locationIP: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Log = mongoose.model("Log", logSchema);
export default Log;
