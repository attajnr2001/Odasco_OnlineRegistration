import React, { useState, useEffect } from "react";
import NetworkStatusWarning from "../helpers/NetworkStatusWarning"; // Import the component
import dayjs from "dayjs";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  MenuItem,
  Snackbar,
  Alert,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useLocationIP, getPlatform } from "../helpers/utils";
import { useGetProgramItemsQuery } from "../slices/programApiSlice";
import { useAddStudentItemMutation } from "../slices/studentApiSlice";

const AddStudentModal = ({ open, onClose }) => {
  const [indexNumber, setIndexNumber] = useState("");
  const [otherNames, setOtherNames] = useState("");
  const [surname, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [status, setStatus] = useState("");
  const [program, setProgram] = useState("");
  const [aggregate, setAggregate] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [jhsAttended, setJhsAttended] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const locationIP = useLocationIP();
  const [studentYear, setStudentYear] = useState(dayjs().year());
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const {
    data: programs,
    isLoading: programsLoading,
    error: programsError,
  } = useGetProgramItemsQuery();
  const [addStudentItem, { isLoading }] = useAddStudentItemMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !indexNumber ||
      !otherNames ||
      !surname ||
      !gender ||
      !status ||
      !program ||
      !aggregate ||
      !dateOfBirth
    ) {
      setSnackbarMessage("Please fill all required fields");
      setSnackbarSeverity("warning");
      setOpenSnackbar(true);
      return;
    }

    // Format the date to ISO string
    const formattedDateOfBirth = new Date(dateOfBirth).toISOString();

    try {
      const result = await addStudentItem({
        indexNumber,
        otherNames,
        surname,
        gender,
        status,
        program,
        aggregate,
        dateOfBirth: formattedDateOfBirth,
        year: studentYear,
        jhsAttended,
      }).unwrap();
      setSnackbarMessage(
        `User added successfully. Admission Number: ${result.admissionNo}`
      );
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      onClose();
    } catch (err) {
      console.error("Failed to add user:", err);
      setSnackbarMessage("Failed to add user");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    } finally {
      handleClose();
    }
  };

  const handleClose = () => {
    setIndexNumber("");
    setOtherNames("");
    setLastName("");
    setGender("");
    setStatus("");
    setProgram("");
    setAggregate("");
    setDateOfBirth("");
    setJhsAttended("");
    setStudentYear(dayjs().year()); // Reset year to current year
    onClose();
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16); // This will return "YYYY-MM-DDTHH:mm"
  };

  useEffect(() => {
    if (programsError) {
      setAlertMessage("Error loading programs. Please try again.");
      setSnackbarOpen(true);
    }
  }, [programsError]);

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Add A Single Record</DialogTitle>
        <DialogContent>
          <TextField
            required
            label="Index Number"
            name="indexNumber"
            fullWidth
            margin="normal"
            value={indexNumber}
            onChange={(e) => setIndexNumber(e.target.value)}
          />
          <TextField
            required
            label="Surname"
            name="surname"
            fullWidth
            margin="normal"
            value={surname}
            onChange={(e) => setLastName(e.target.value)}
          />

          <TextField
            required
            label="Other Names"
            name="otherNames"
            fullWidth
            margin="normal"
            value={otherNames}
            onChange={(e) => setOtherNames(e.target.value)}
          />
          <TextField
            required
            label="Gender"
            name="gender"
            select
            fullWidth
            margin="normal"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            {["Male", "Female"].map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            required
            label="Status"
            name="status"
            select
            fullWidth
            margin="normal"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {["Day", "Boarding"].map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            required
            select
            label="Program"
            name="program"
            fullWidth
            margin="normal"
            value={program}
            onChange={(e) => setProgram(e.target.value)}
            disabled={programsLoading}
          >
            {programsLoading ? (
              <MenuItem value="">Loading programs...</MenuItem>
            ) : programsError ? (
              <MenuItem value="">Error loading programs</MenuItem>
            ) : (
              programs.map((prog) => (
                <MenuItem key={prog._id} value={prog._id}>
                  {prog.name}
                </MenuItem>
              ))
            )}
          </TextField>
          <TextField
            required
            label="JHS Attended"
            name="jhsAttended"
            fullWidth
            margin="normal"
            value={jhsAttended}
            onChange={(e) => setJhsAttended(e.target.value)}
          />
          <TextField
            required
            label="Aggregate of best 6"
            name="aggregate"
          type="number"
            fullWidth
            margin="normal"
            value={aggregate}
            onChange={(e) => setAggregate(e.target.value)}
          />

          <TextField
            required
            label="Date Of Birth"
            name="dateOfBirth"
            type="date"
            fullWidth
            margin="normal"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? "Adding..." : "Add"}
          </Button>
        </DialogContent>
      </Dialog>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <NetworkStatusWarning />
    </>
  );
};

export default AddStudentModal;
