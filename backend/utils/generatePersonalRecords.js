import asyncHandler from "express-async-handler";
import { jsPDF } from "jspdf";
import fetch from "node-fetch";
import QRCode from "qrcode";
import Student from "../models/Student.js";
import School from "../models/School.js";
import Program from "../models/Program.js";
import House from "../models/House.js";

const getProgramShortName = async (programId) => {
  const program = await Program.findById(programId);
  return program ? program.shortName : "N/A";
};

const getProgramName = async (programId) => {
  const program = await Program.findById(programId);
  return program ? program.name : "N/A";
};

const getHouseName = async (houseId) => {
  const house = await House.findById(houseId);
  return house ? house.name : "N/A";
};

const generatePersonalRecords = asyncHandler(async (req, res) => {
  const { studentId } = req.body;
  const student = await Student.findById(studentId).populate(
    "program house photo"
  );
  console.log(studentId);
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

    const doc = new jsPDF();
    doc.addImage(schoolImageBase64, "JPEG", 10, 10, 10, 10);

    let currentY = 14; // Start from y = 14
    doc.setFontSize(10);
    doc.setFont("", "bold"); // Set font to bold
    doc.text(`${school.name}`, 23, currentY);
    doc.setFont("", "normal");
    currentY += 5; // Increment currentY by 5 for the next line

    doc.text(`Post Office Box ${school.box} ${school.address}`, 23, currentY);
    currentY += 2;
    doc.setDrawColor(0); // Set the line color to black (0 is black, 255 is white)
    doc.line(10, currentY, 200, currentY); // Draw a line at the current y-coordinate
    currentY += 10; // Increment currentY by 5 for the next line

    doc.setFontSize(18);
    doc.setFont("", "bold");
    doc.text(`${school.name.toUpperCase()} SCHOOL`, 60, currentY);
    currentY += 10;

    doc.addImage(schoolImageBase64, "JPEG", 85, currentY, 30, 30);
    currentY += 35;

    doc.setFontSize(12);
    doc.text(
      `POST OFFICE BOX ${school.box}, ${school.address.toUpperCase()}`,
      45,
      currentY
    );
    currentY += 5;

    doc.text(`PHONE: ${school.phone}`, 72, currentY);
    currentY += 5;

    doc.text(`EMAIL: ${school.email}`, 68, currentY);
    currentY += 5;

    doc.line(10, currentY, 200, currentY); // Draw a line at the current y-coordinate
    currentY += 10;

    doc.setFontSize(18);
    doc.text(`PERSONAL RECORDS FORM`, 60, currentY);

    currentY += 5;

    doc.addImage(studentImageBase64, "JPEG", 85, currentY, 35, 35);
    currentY += 45;

    doc.setFontSize(12);
    doc.text(`ENROLLMENT DATA`, 80, currentY);
    currentY += 10;

    doc.setFontSize(12);
    doc.setFont("", "normal");
    doc.text("Student Name: ", 10, currentY);
    doc.setFontSize(13);
    doc.setFont("", "bold");
    doc.text(
      `${student.otherNames.toUpperCase()} ${student.surname.toUpperCase()}`,
      37,
      currentY
    );
    doc.setFontSize(12);
    doc.setFont("", "normal");
    doc.text("BECE Index Number: ", 100, currentY);
    doc.setFontSize(13);
    doc.setFont("", "bold");
    doc.text(`${student.indexNumber}`, 140, currentY);
    currentY += 10;

    doc.setFontSize(12);
    doc.setFont("", "normal");
    doc.text("Admission Number: ", 10, currentY);
    doc.setFontSize(13);
    doc.setFont("", "bold");
    doc.text(
      `${await getProgramShortName(student.program)}${year}${
        student.admissionNo
      }`,
      45,
      currentY
    );
    doc.setFontSize(12);
    doc.setFont("", "normal");
    doc.text("Residential Status: ", 100, currentY);
    doc.setFontSize(13);
    doc.setFont("", "bold");
    doc.text(`${student.status.toUpperCase()}`, 132, currentY);
    currentY += 10;

    doc.setFontSize(12);
    doc.setFont("", "normal");
    doc.text("Gender: ", 10, currentY);
    doc.setFontSize(13);
    doc.setFont("", "bold");
    doc.text(`${student.gender}`, 25, currentY);
    doc.setFontSize(12);
    doc.setFont("", "normal");
    doc.text("Raw Score: ", 100, currentY);
    doc.setFontSize(13);
    doc.setFont("", "bold");
    doc.text(`${student.rawScore}`, 120, currentY);
    currentY += 10;

    doc.setFontSize(12);
    doc.setFont("", "normal");
    doc.text("Aggregate of Best 6: ", 10, currentY);
    doc.setFontSize(13);
    doc.setFont("", "bold");
    doc.text(`${student.aggregate}`, 47, currentY);
    doc.setFontSize(12);
    doc.setFont("", "normal");
    doc.text("JHS Attended: ", 100, currentY);
    doc.setFontSize(12);
    doc.setFont("", "bold");
    doc.text(`${student.jhsAttended}`, 127, currentY);
    currentY += 10;

    doc.setFontSize(12);
    doc.setFont("", "normal");
    doc.text("Enrollment Code: ", 10, currentY);
    doc.setFontSize(13);
    doc.setFont("", "bold");
    doc.text(`${student.enrollmentCode}`, 42, currentY);
    doc.setFontSize(12);
    doc.setFont("", "normal");
    doc.text("House: ", 100, currentY);
    doc.setFontSize(13);
    doc.setFont("", "bold");
    doc.text(`${await getHouseName(student.house)}`, 113, currentY);
    currentY += 10;

    doc.setFontSize(12);
    doc.setFont("", "normal");
    doc.text("JHS Type: ", 10, currentY);
    doc.setFontSize(13);
    doc.setFont("", "bold");
    doc.text(`${student.jhsType.toUpperCase()}`, 30, currentY);
    doc.setFontSize(12);
    doc.setFont("", "normal");
    doc.text("Class: ", 100, currentY);
    doc.setFontSize(13);
    doc.setFont("", "bold");
    doc.text(`${""}`, 30, currentY);
    currentY += 15;

    doc.setFontSize(12);
    doc.text(`CONTACT DATA`, 80, currentY);
    currentY += 10;

    doc.setFontSize(12);
    doc.setFont("", "normal");
    doc.text("Gender: ", 10, currentY);
    doc.setFontSize(13);
    doc.setFont("", "bold");
    doc.text(`${student.gender.toUpperCase()}`, 25, currentY);
    doc.setFontSize(12);
    doc.setFont("", "normal");
    doc.text("Date of Birth: ", 100, currentY);
    doc.setFontSize(13);
    doc.setFont("", "bold");
    doc.text(`${student.dateOfBirth.toLocaleDateString()}`, 125, currentY);
    currentY += 10;

    doc.setFontSize(12);
    doc.setFont("", "normal");
    doc.text("Nationality: ", 10, currentY);
    doc.setFontSize(13);
    doc.setFont("", "bold");
    doc.text(`${student.nationality}`, 30, currentY);
    doc.setFontSize(12);
    doc.setFont("", "normal");
    doc.text("Address: ", 100, currentY);
    doc.setFontSize(13);
    doc.setFont("", "bold");
    doc.text(`${student.permanentAddress}`, 117, currentY);
    currentY += 10;

    doc.setFontSize(12);
    doc.setFont("", "normal");
    doc.text("Place of Birth: ", 10, currentY);
    doc.setFontSize(13);
    doc.setFont("", "bold");
    doc.text(`${student.placeOfBirth}`, 35, currentY);
    doc.setFontSize(12);
    doc.setFont("", "normal");
    doc.text("Religion: ", 100, currentY);
    doc.setFontSize(13);
    doc.setFont("", "bold");
    doc.text(`${student.religion}`, 117, currentY);
    currentY += 10;

    doc.setFontSize(12);
    doc.setFont("", "normal");
    doc.text("Town: ", 10, currentY);
    doc.setFontSize(13);
    doc.setFont("", "bold");
    doc.text(`${student.town}`, 23, currentY);
    doc.setFontSize(12);
    doc.setFont("", "normal");
    doc.text("District: ", 100, currentY);
    doc.setFontSize(13);
    doc.setFont("", "bold");
    doc.text(`${student.district}`, 117, currentY);
    currentY += 10;

    // end pdf stream
    const pdfBuffer = doc.output("arraybuffer");

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

export { generatePersonalRecords };
