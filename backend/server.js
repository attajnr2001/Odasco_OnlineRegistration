import path from "path";
import express from "express";
import dotenv from "dotenv";
dotenv.config();
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
import cors from "cors";

const port = process.env.PORT || 5000;
connectDB();

const app = express();

app.use(express.json());

const allowedOrigins = [
  "https://odasco-onlineregistration-admin.onrender.com",
  "http://localhost:3000", // Assuming your Vite dev server runs on port 3000
  "http://localhost:5173", // Another common Vite dev server port
  "http://localhost:5174", // Another common Vite dev server port
];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use("/api/users", userRoutes);
app.use("/api/houses", houseRoutes);
app.use("/api/programs", programRoutes);
app.use("/api/schools", schoolRoutes);
app.use("/api/students", studentRoutes);

app.use("/api/clients", clientRoutes);
app.use("/api/pdf", pdfRoutes);
app.use("/api/logs", logRoutes);

app.get("/", (req, res) => {
  res.send("API Starting point");
});

app.listen(port, () => console.log(`Server started on port ${port}`));
