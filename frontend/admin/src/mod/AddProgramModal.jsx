import React, { useState, useEffect } from "react";
import NetworkStatusWarning from "../helpers/NetworkStatusWarning"; // Import the component

import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useLocationIP, getPlatform } from "../helpers/utils";
import { useAddProgramItemMutation } from "../slices/programApiSlice";

const AddProgramModal = ({ open, onClose, onAddProgram }) => {
  const [addProgramItem, { isLoading }] = useAddProgramItemMutation();

  const [formData, setFormData] = useState({
    programID: "",
    name: "",
    shortName: "",
    noOfStudents: "0",
  });

  const [error, setError] = useState(null);
  const locationIP = useLocationIP();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddProgram = async () => {
    const uppercaseProgramName = formData.name.toUpperCase();
    console.log(formData.programID);
    if (
      !formData.name ||
      !formData.shortName ||
      !formData.programID ||
      formData.noOfStudents === ""
    ) {
      setError("All fields are required.");
      return;
    }
    try {
      const result = await addProgramItem({
        ...formData,
        name: uppercaseProgramName,
        noOfStudents: parseInt(formData.noOfStudents),
      }).unwrap();

      console.log(result);

      setError(null);
      setSnackbarMessage("Program added successfully");
      setSnackbarOpen(true);
      onClose();
    } catch (err) {
      setError(err.data?.message || err.error);
      console.log(err);
    }
  };

  const handleCloseSnackbar = () => {
    setError(null);
  };
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add New Program</DialogTitle>
      <DialogContent>
        <TextField
          label="Program ID"
          name="programID"
          value={formData.programID}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Program Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Short Name"
          name="shortName"
          value={formData.shortName}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          type="number"
          label="Number of Students"
          name="noOfStudents"
          value={formData.noOfStudents}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddProgram}
          size="small"
          disabled={isLoading}
        >
          {isLoading ? "Adding..." : "Add"}
        </Button>
      </DialogContent>
      {error && (
        <Snackbar
          open={Boolean(error)}
          autoHideDuration={6000}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert severity="error" onClose={handleCloseSnackbar}>
            {error}
          </Alert>
        </Snackbar>
      )}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          severity={snackbarMessage.includes("Error") ? "error" : "success"}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <NetworkStatusWarning />
    </Dialog>
  );
};

export default AddProgramModal;
