import React, { useState, useEffect } from "react";
import NetworkStatusWarning from "../helpers/NetworkStatusWarning";
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
import { useLocationIP, getPlatform, useCreateLog } from "../helpers/utils";
import { useAddProgramItemMutation } from "../slices/programApiSlice";

const AddProgramModal = ({ open, onClose, onAddProgram }) => {
  const [addProgramItem, { isLoading }] = useAddProgramItemMutation();
  const createLog = useCreateLog();
  const { locationIP, loading: ipLoading } = useLocationIP();

  const [formData, setFormData] = useState({
    programID: "",
    name: "",
    shortName: "",
    noOfStudents: "0",
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddProgram = async () => {
    const uppercaseProgramName = formData.name.toUpperCase();
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

      onAddProgram(result);

      if (!ipLoading) {
        await createLog("Program added", result._id, locationIP);
      } else {
        console.log("IP address not available yet");
      }

      setSuccess("Program added successfully");
      setTimeout(() => {
        onClose();
        setSuccess(null);
      }, 2000);
    } catch (err) {
      setError(err.data?.message || err.error);
    }
  };

  const handleCloseSnackbar = () => {
    setError(null);
    setSuccess(null);
  };

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Add New Program</DialogTitle>
        <DialogContent>
          <TextField
            name="programID"
            label="Program ID"
            value={formData.programID}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="name"
            label="Name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="shortName"
            label="Short Name"
            value={formData.shortName}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="noOfStudents"
            label="Number of Students"
            type="number"
            value={formData.noOfStudents}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <Button
            onClick={handleAddProgram}
            color="primary"
            variant="contained"
            disabled={isLoading}
          >
            {isLoading ? "Adding..." : "Add"}
          </Button>
        </DialogContent>
      </Dialog>
      <Snackbar
        open={!!error || !!success}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={error ? "error" : "success"}
        >
          {error || success}
        </Alert>
      </Snackbar>
      <NetworkStatusWarning />
    </>
  );
};

export default AddProgramModal;
