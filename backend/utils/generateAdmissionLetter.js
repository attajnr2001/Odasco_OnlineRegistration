// generateAdmissionLetter.js
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

const generateAdmissionLetter = asyncHandler(async (req, res) => {
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

    doc.setFontSize(18);
    doc.setFont("", "bold");
    doc.text(`${school.name.toUpperCase()}`, 55, currentY);
    currentY += 5;
    doc.setDrawColor(0);

    currentY += 1;

    doc.setFontSize(10);
    doc.text(`(GHANA EDUCATION SERVICE)`, 65, currentY);
    currentY += 5;

    doc.text(`THE HEADMASTER`, 10, currentY);
    currentY += 5;
    doc.text(`OUR REF NUMBER:  ${school.senderID}`, 10, currentY);
    currentY += 5;
    doc.text(`YOUR REF NUMBER: ...............`, 10, currentY);
    currentY += 5;
    doc.text(`PHONE: ${school.phone}`, 10, currentY);
    currentY += 5;
    doc.text(`EMAIL: ${school.email}`, 10, currentY);
    currentY += 20;

    doc.text(`POST OFFICE BOX: ${school.box}`, 155, 44);
    doc.text(`Date: ${formattedDate}`, 155, 48);
    doc.addImage(schoolImageBase64, "JPEG", 87, 47, 35, 35);

    doc.line(10, currentY, 200, currentY);

    currentY += 10;
    doc.setFont("", "normal");
    doc.setFontSize(12);
    doc.text(`Dear Student,`, 10, currentY);
    currentY += 12;

    doc.setFont("", "bold");
    doc.setFontSize(12);
    doc.text(
      `OFFER OF ADMISSION INTO SENIOR HIGH SCHOOL- 2023/2024 ACADEMIC YEAR`,
      13,
      currentY
    );
    currentY += 1;
    doc.line(13, currentY, 180, currentY);

    currentY += 10;
    doc.setFont("", "bold");
    doc.addImage(studentImageBase64, "JPEG", 150, currentY, 30, 30);
    doc.text(`ENROLLMENT CODE: ${student.enrollmentCode}`, 10, currentY);
    currentY += 6;
    doc.text(
      `STUDENT NAME: ${student.surname.toUpperCase()} ${student.otherNames.toUpperCase()}`,
      10,
      currentY
    );
    currentY += 6;
    doc.text(
      `RESIDENTIAL STATUS: ${student.status.toUpperCase()}`,
      10,
      currentY
    );
    currentY += 6;
    doc.text(
      `PROGRAMME: ${await getProgramName(student.program)}`,
      10,
      currentY
    );
    currentY += 6;
    doc.text(
      `ADMISSION NUMBER: ${await getProgramShortName(student.program)}${year}${
        student.admissionNo
      }`,
      10,
      currentY
    );
    currentY += 6;
    doc.text(`HOUSE: ${await getHouseName(student.house)}`, 10, currentY);
    currentY += 12;

    currentY += 6;
    doc.setFont("", "normal");

    doc.text(
      `I am pleased to inform you that you have been offered a place at ${school.name.toUpperCase()} to
  pursue a 3 year Pre-Tertiary programme leading to the West Africa Senior School Certificate
  Examination`,
      10,
      currentY
    );
    currentY += 20;

    doc.text(
      `1. The reporting date for all first year students is on Monday, ${school.schOpeningDateTime.toLocaleDateString()} AM
        
  2.  You will be required to adhere religiously to all school rules and regulations as a student
        
  3. All students of the school are considered to be on probation throughout their stay in the school and
  could be withdrawn/dismissed at anytime for gross misconduct.
  
  
  4. On the reporting day, you are to submit a printed copy of this Admission Letter to the Senior
  Housemaster/Housemistress for registration and other admission formalities.
  
  5. All students are expected to have active Health Insurance cards and this would be inspected by
  the Housemaster/Housemistress.
  
  6. Please accept our congratulations.
  
  Yours faithfully,
  
  --Digitally Signed and Secured in QR Code--
  
  ..........................................................................
  ${school.headMasterName.toUpperCase()}
  (HEADMASTER)
  `,
      10,
      currentY
    );
    currentY += 10;

    doc.addImage(qrCodeBase64, "JPEG", 150, currentY + 50, 30, 30);


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

export { generateAdmissionLetter };
