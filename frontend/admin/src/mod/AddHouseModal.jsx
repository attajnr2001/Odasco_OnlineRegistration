import React, { useState, useEffect } from "react";
import NetworkStatusWarning from "../helpers/NetworkStatusWarning"; // Import the component

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
import { useDispatch, useSelector } from "react-redux";
import { useLocationIP, useCreateLog } from "../helpers/utils";
import { useAddHouseItemMutation } from "../slices/houseApiSlice";

const AddHouseModal = ({ open, onClose, onAddHouse }) => {
  const [addHouseItem, { isLoading }] = useAddHouseItemMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: "",
    noOfStudents: "0",
    gender: "",
    bedCapacity: "",
  });
  const [error, setError] = useState(null);
  const { locationIP, loading: ipLoading } = useLocationIP();
  const createLog = useCreateLog();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddHouse = async () => {
    if (!formData.name || !formData.gender || !formData.bedCapacity) {
      setError("All fields are required.");
      return;
    }

    try {
      const result = await addHouseItem({
        ...formData,
        noOfStudents: parseInt(formData.noOfStudents),
        bedCapacity: parseInt(formData.bedCapacity),
      }).unwrap();

      // Add log entry
      if (!ipLoading) {
        await createLog(
          `New House Added - ${formData.name}`,
          userInfo._id,
          locationIP
        );
      } else {
        console.log("IP address not available yet");
      }

      setSnackbarMessage("House added successfully");
      setSnackbarOpen(true);
    } catch (err) {
      setError(err.data?.message || err.error);
    } finally {
      onClose();
    }
  };

  const handleCloseSnackbar = () => {
    setError(null);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add New House</DialogTitle>
      <DialogContent>
        <TextField
          label="House Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />

        <TextField
          label="Number of Students"
          name="noOfStudents"
          type="number"
          value={formData.noOfStudents}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Gender"
          name="gender"
          select
          value={formData.gender}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
          InputLabelProps={{
            shrink: true,
          }}
        >
          {["Male", "Female"].map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Bed Capacity"
          name="bedCapacity"
          type="number"
          value={formData.bedCapacity}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddHouse}
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
      {/* <Snackbar
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
      </Snackbar> */}
      <NetworkStatusWarning />
    </Dialog>
  );
};

export default AddHouseModal;
