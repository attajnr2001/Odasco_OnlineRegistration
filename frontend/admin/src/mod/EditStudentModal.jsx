import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Avatar,
  IconButton,
  Box,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import NetworkStatusWarning from "../helpers/NetworkStatusWarning";
import { useUpdateStudentItemMutation } from "../slices/studentApiSlice";
import { Camera } from "@mui/icons-material";
import { useParams } from "react-router-dom";
import { useLocationIP, getPlatform } from "../helpers/utils";

const EditStudentModal = ({ open, onClose, student, houses, programs }) => {
  const [file, setFile] = useState("");
  const [shouldCloseModal, setShouldCloseModal] = useState(false);
  const [formData, setFormData] = useState({
    indexNumber: "",
    house: "",
    otherNames: "",
    surname: "",
    program: "",
    year: "",
    status: "",
    photo: "",
  });
  const [updateStudentItem, { isLoading: isUpdating }] =
    useUpdateStudentItemMutation();
  const [uploading, setUploading] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success"); // Add state for alert severity
  const [isSaving, setIsSaving] = useState(false); // Add state to manage save button disable state
  const locationIP = useLocationIP();

  const handleAlertClose = () => {
    setAlertMessage(""); // Clear alert message
  };

  useEffect(() => {
    if (student) {
      setFormData({
        _id: student._id,
        indexNumber: student.indexNumber || "",
        house: student.house || "",
        otherNames: student.otherNames || "",
        surname: student.surname || "",
        program: student.program || "",
        year: student.year || "",
        status: student.status || "",
        photo: student.photo || "",
      });
    }
  }, [student]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!student || !student._id) {
      setAlertMessage("Invalid student ID");
      setAlertSeverity("error");
      return;
    }
    try {
      const result = await updateStudentItem(formData).unwrap();
      setAlertMessage("Student updated successfully");
      setAlertSeverity("success");
      setShouldCloseModal(true); // Set this to true instead of calling onClose()
    } catch (err) {
      console.error("Error updating student:", err);
      setAlertMessage(
        err.data?.message || "An error occurred while updating the student"
      );
      setAlertSeverity("error");
    }
  };

  useEffect(() => {
    if (shouldCloseModal) {
      const timer = setTimeout(() => {
        onClose();
        setShouldCloseModal(false);
      }, 2000); // Adjust this time as needed

      return () => clearTimeout(timer);
    }
  }, [shouldCloseModal, onClose]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Student</DialogTitle>
      <DialogContent>
        <Box>
          <Avatar
            sx={{ width: "100px", height: "100px", marginBottom: "10px" }}
            src={formData.photo || ""}
            alt="Student Image"
          />

          <input
            accept="image/*"
            id="icon-button-file"
            type="file"
            style={{ display: "none" }}
            onChange={(e) => setFile(e.target.files[0])}
          />
          <label htmlFor="icon-button-file">
            <IconButton
              color="primary"
              aria-label="upload picture"
              component="span"
            >
              <Camera />
            </IconButton>
          </label>
        </Box>

        <TextField
          label="Index Number"
          name="indexNumber"
          fullWidth
          margin="normal"
          value={formData.indexNumber}
          onChange={(e) =>
            setFormData({ ...formData, indexNumber: e.target.value })
          }
        />
        <TextField
          select
          label="House"
          name="house"
          fullWidth
          margin="normal"
          value={formData.house}
          onChange={(e) => setFormData({ ...formData, house: e.target.value })}
        >
          {houses &&
            houses.map((house) => (
              <MenuItem key={house._id} value={house._id}>
                {house.name}
              </MenuItem>
            ))}
        </TextField>
        <TextField
          label="Other Names"
          name="otherNames"
          fullWidth
          margin="normal"
          value={formData.otherNames}
          onChange={(e) =>
            setFormData({ ...formData, otherNames: e.target.value })
          }
        />
        <TextField
          label="Surname"
          name="surname"
          fullWidth
          margin="normal"
          value={formData.surname}
          onChange={(e) =>
            setFormData({ ...formData, surname: e.target.value })
          }
        />
        <TextField
          select
          label="Program"
          name="program"
          fullWidth
          margin="normal"
          value={formData.program}
          onChange={(e) =>
            setFormData({ ...formData, program: e.target.value })
          }
        >
          {programs &&
            programs.map((program) => (
              <MenuItem key={program._id} value={program._id}>
                {program.name}
              </MenuItem>
            ))}
        </TextField>
        <TextField
          label="Year"
          name="year"
          type="number"
          fullWidth
          margin="normal"
          value={formData.year}
          onChange={(e) => setFormData({ ...formData, year: e.target.value })}
        />
        <TextField
          select
          label="Status"
          name="status"
          fullWidth
          margin="normal"
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
        >
          <MenuItem value="Boarding">Boarding</MenuItem>
          <MenuItem value="Day">Day</MenuItem>
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={onClose}>
          Cancel
        </Button>
        <Button
          color="primary"
          variant="contained"
          onClick={handleSave}
          disabled={isUpdating}
        >
          {isUpdating ? "Saving..." : "Save"}
        </Button>
      </DialogActions>
      <Snackbar
        open={!!alertMessage}
        autoHideDuration={2000} // Adjust this time as needed
        onClose={() => {
          setAlertMessage("");
          setShouldCloseModal(false);
        }}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setAlertMessage("")} severity={alertSeverity}>
          {alertMessage}
        </Alert>
      </Snackbar>
      <NetworkStatusWarning />
    </Dialog>
  );
};

export default EditStudentModal;
