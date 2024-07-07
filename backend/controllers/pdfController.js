// controllers/pdfController.js
import asyncHandler from "express-async-handler";
import { jsPDF } from "jspdf"; // Change this line
import fetch from "node-fetch";
import QRCode from "qrcode";
import { storage } from "../firebaseConfig.js";
import Student from "../models/Student.js";
import School from "../models/School.js";
import Program from "../models/Program.js";
import House from "../models/House.js";

const generateAdmissionLetter = asyncHandler(async (req, res) => {
  const { studentId } = req.body;
  const student = await Student.findById(studentId).populate("program house photo");
  console.log(studentId)
  const school = await School.findOne();

  if (!student || !school) {
    res.status(404);
    throw new Error("Student or school data not found");
  }

  const currentDate = new Date();
  const day = currentDate.getDate();
  const month = currentDate.toLocaleString("default", { month: "long" });
  const year = currentDate.getFullYear();
  const formattedDate = `${day}th ${month} ${year}`;

  try {
    // Fetch student image
    const studentImageResponse = await fetch(student.photo);
    const studentImageBuffer = await studentImageResponse.arrayBuffer();
    const studentImageBase64 =
      Buffer.from(studentImageBuffer).toString("base64");

    // Fetch school image
    const schoolImageResponse = await fetch(school.logo);
    const schoolImageBuffer = await schoolImageResponse.arrayBuffer();
    const schoolImageBase64 = Buffer.from(schoolImageBuffer).toString("base64");

    // Generate QR Code
    const qrCodeData = "Your ICT";
    const qrCodeBase64 = await QRCode.toDataURL(qrCodeData);

    // Create PDF
    const doc = new jsPDF();

    // Add content to PDF (similar to your frontend function)
    doc.addImage(schoolImageBase64, "JPEG", 10, 10, 10, 10);

    let currentY = 14;
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(`${school.name}`, 23, currentY);
    doc.setFont("helvetica", "normal");
    currentY += 5;

    doc.text(`Post Office Box ${school.box} ${school.address}`, 23, currentY);
    currentY += 2;
    doc.setDrawColor(0);
    doc.line(10, currentY, 200, currentY);
    currentY += 10;

    // ... (Continue adding content as in your frontend function)
    doc.addImage(studentImageBase64, "JPEG", 10, 30, 10, 10);

    // Instead of saving, we'll get the PDF as a buffer
    const pdfBuffer = doc.output("arraybuffer");

    // Set response headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=admission_letter.pdf"
    );

    // Send the PDF
    res.send(Buffer.from(pdfBuffer));
  } catch (error) {
    console.error("Error generating PDF:", error);
    res
      .status(500)
      .json({ message: "Error generating PDF", error: error.toString() });
  }
});

export { generateAdmissionLetter };
