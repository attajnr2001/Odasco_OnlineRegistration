import path from "path";
import express from "express";
import dotenv from "dotenv";
dotenv.config();
import multer from "multer";
import cors from "cors";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";
import houseRoutes from "./routes/houseRoutes.js";
import programRoutes from "./routes/programRoutes.js";
import schoolRoutes from "./routes/schoolRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import clientRoutes from "./routes/clientRoutes.js";
import logRoutes from "./routes/logRoutes.js";
import pdfRoutes from "./routes/pdfRoutes.js";

const port = process.env.PORT || 5000;
connectDB();

const app = express();
app.use(cors()); 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); 
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));  
  },
});

const upload = multer({ storage: storage });

app.post("/api/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded."); 
  }

  
  const filePath = req.file.path; 
  console.log(filePath)
  // TODO: Save filePath to your MongoDB database

  res.send("File uploaded successfully");
});

app.use(cookieParser());
app.use("/api/users", userRoutes);
app.use("/api/houses", houseRoutes);
app.use("/api/programs", programRoutes);
app.use("/api/schools", schoolRoutes);
app.use("/api/students", studentRoutes);

app.use("/api/clients", clientRoutes);
app.use("/api/pdf", pdfRoutes);
app.use("/api/logs", logRoutes);

app.listen(port, () => console.log(`Server started on port ${port}`));
