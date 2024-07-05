import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Alert,
  Snackbar,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useLocationIP, getPlatform } from "../helpers/utils";
import NetworkStatusWarning from "../helpers/NetworkStatusWarning"; // Import the component
import { useUpdateProgramItemMutation } from "../slices/programApiSlice";

const EditProgramModal = ({ open, onClose, rowData }) => {
  const [updateProgramItem, { isLoading }] = useUpdateProgramItemMutation();
  const [formData, setFormData] = useState({
    programID: "",
    name: "",
    shortName: "",
    noOfStudents: "",
  });

  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const locationIP = useLocationIP();

  useEffect(() => {
    if (rowData) {
      setFormData({
        programID: rowData.programID || "",
        name: rowData.name || "",
        shortName: rowData.shortName || "",
        noOfStudents: rowData.noOfStudents || "",
      });
    }
  }, [rowData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEditProgram = async () => {
    try {
      await updateProgramItem({
        id: rowData._id,
        ...formData,
        noOfStudents: parseInt(formData.noOfStudents),
      }).unwrap();

      setSnackbarMessage("Program updated successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      onClose();
    } catch (error) {
      console.error("Error updating program:", error);
      setSnackbarMessage(
        "Error updating program: " + error.data?.message || error.error
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Edit Program</DialogTitle>
        <DialogContent>
          <TextField
            label="Program ID"
            name="programID"
            value={formData.programID}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Program Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Short Name"
            name="shortName"
            value={formData.shortName}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            type="number"
            label="Number of Students"
            name="noOfStudents"
            value={formData.noOfStudents}
            onChange={handleChange}
            fullWidth
            disabled
            margin="normal"
            helperText="This is an automatic updated value"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleEditProgram}
            sx={{ marginBottom: "1em" }}
            disabled={isLoading}
          >
            {isLoading ? "Updating..." : "Update"}
          </Button>
        </DialogContent>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
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

export default EditProgramModal;
