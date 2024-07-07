import React, { useState } from "react";
import {
  Input,
  DialogTitle,
  DialogContent,
  Button,
  Dialog,
  DialogActions,
  Alert,
} from "@mui/material";
import * as XLSX from "xlsx";
import { useAddStudentItemMutation } from "../slices/studentApiSlice";
import { useLocationIP, getPlatform } from "../helpers/utils";
import NetworkStatusWarning from "../helpers/NetworkStatusWarning";
import dayjs from "dayjs";

const ImportStudentExcel = ({ open, onClose, programs, schoolID }) => {
  const [excelFile, setExcelFile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const locationIP = useLocationIP();
  const [addStudentItem] = useAddStudentItemMutation();
  const [studentYear, setStudentYear] = useState(dayjs().year());

  const handleFileChange = (event) => {
    const allowedTypes = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/csv",
    ];
    const file = event.target.files[0];
    if (file) {
      if (allowedTypes.includes(file.type)) {
        setError(null);
        const reader = new FileReader();
        reader.onload = (e) => {
          setExcelFile(e.target.result);
        };
        reader.readAsArrayBuffer(file);
      } else {
        setError(<Alert severity="error">Only Excel Files are accepted</Alert>);
        setExcelFile(null);
      }
    }
  };

  const handleUpload = async () => {
    if (excelFile) {
      setLoading(true);
      try {
        const workbook = XLSX.read(excelFile, { type: "buffer" });
        const worksheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[worksheetName];
        const data = XLSX.utils.sheet_to_json(worksheet);

        if (data) {
          const studentsToSave = data.map((student) => ({
            aggregate: student["Aggregate"] || "",
            dateOfBirth: student["Date of Birth(dd/mm/yyyy)"] || "",
            otherNames: student["Other Names"] || "",
            gender: student["Gender"] || "",
            jhsAttended: student["JHS Attended"] || "",
            indexNumber: student["JHS Index No"],
            surname: student["Surname"] || "",
            program: student["Programme"] || "",
            smsContact: student["SMS Contact"] || "",
            status: student["Boarding Status"] || "Day",
            completed: false,
            hasPaid: false,
            year: studentYear,
          }));

          // Create a map of program names to program IDs
          const programMap = programs.reduce((acc, program) => {
            acc[program.name] = program._id;
            return acc;
          }, {});

          // Replace program names with program IDs and add schoolID
          const studentsWithProgramIds = studentsToSave.map((student) => ({
            ...student,
            program: programMap[student.program] || null,
            schoolID: schoolID,
          }));

          // Save students to the database
          for (const student of studentsWithProgramIds) {
            try {
              await addStudentItem(student).unwrap();
            } catch (err) {
              console.error(`Error adding student: ${err}`);
              // Optionally, you can set an error state here to show to the user
            }
          }

          console.log("Students saved successfully");
          onClose(); // Close the dialog after successful upload
        }
      } catch (error) {
        console.error("Error processing Excel file:", error);
        setError(<Alert severity="error">Error processing Excel file</Alert>);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Import Student Excel</DialogTitle>
      <DialogContent>
        <a
          href={
            "https://firebasestorage.googleapis.com/v0/b/shsreg-bb2a1.appspot.com/o/student%20temp%20(4).xlsx?alt=media&token=9da2c73c-bf9e-4994-a4fa-a6f8ae97163f"
          }
          download
        >
          <Button variant="contained" size="small" color="primary">
            Download Template
          </Button>
        </a>

        <p>
          Please click the button above to download the template. Once
          downloaded, copy the CSSPS list into the template, and then upload the
          completed template.
        </p>
        <Input
          type="file"
          sx={{ margin: "1em 0" }}
          onChange={handleFileChange}
          accept=".xlsx, .xls, .csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, text/csv"
        />
        <p>
          You are only allowed to upload excel files, precisely the excel file
          from the template you have edited. Make sure the excel file is
          populated
        </p>
        <Button
          variant="contained"
          size="small"
          color="primary"
          onClick={handleUpload}
          sx={{ margin: "1em 0" }}
          disabled={!excelFile || loading}
        >
          {loading ? "Uploading File" : "Upload File"}
        </Button>
        {error && <>{error}</>}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
      </DialogActions>
      <NetworkStatusWarning />
    </Dialog>
  );
};

export default ImportStudentExcel;
