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
import pdfRoutes from './routes/pdfRoutes.js';

const port = process.env.PORT || 5000;
connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use("/api/users", userRoutes);
app.use("/api/houses", houseRoutes);
app.use("/api/programs", programRoutes);
app.use("/api/schools", schoolRoutes);
app.use("/api/students", studentRoutes);

app.use("/api/clients", clientRoutes); 
app.use('/api/pdf', pdfRoutes);

app.listen(port, () => console.log(`Server started on port ${port}`));
