import React, { useState, useEffect } from "react";
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
import NetworkStatusWarning from "../helpers/NetworkStatusWarning"; // Import the component
import { useLocationIP, useCreateLog } from "../helpers/utils";
import { useUpdateHouseItemMutation } from "../slices/houseApiSlice";
import { useDispatch, useSelector } from "react-redux";

const EditHouseModal = ({ open, onClose, rowData }) => {
  const [updateHouseItem, { isLoading }] = useUpdateHouseItemMutation();
  const [formData, setFormData] = useState({
    name: "",
    noOfStudents: "",
    gender: "",
    bedCapacity: "",
  });
  const { userInfo } = useSelector((state) => state.auth);
  const createLog = useCreateLog();
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const { locationIP, loading: ipLoading } = useLocationIP();

  useEffect(() => {
    if (rowData) {
      setFormData({
        name: rowData.name || "",
        noOfStudents: rowData.noOfStudents || "",
        gender: rowData.gender || "",
        bedCapacity: rowData.bedCapacity || "",
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

  const handleEditHouse = async () => {
    try {
      await updateHouseItem({
        id: rowData._id,
        ...formData,
        noOfStudents: parseInt(formData.noOfStudents),
        bedCapacity: parseInt(formData.bedCapacity),
      }).unwrap();

      if (!ipLoading) {
        await createLog(`House ${formData.name} updated`, userInfo._id, locationIP);
      } else {
        console.log("IP address not available yet");
      }

      setSnackbarMessage("House updated successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      onClose();
    } catch (error) {
      console.error("Error updating house:", error);
      setSnackbarMessage(
        "Error updating house: " + error.data?.message || error.error
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
        <DialogTitle>Edit House</DialogTitle>
        <DialogContent>
          <TextField
            label="House Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />

          <TextField
            label="Number of Students"
            name="noOfStudents"
            type="number"
            value={formData.noOfStudents}
            onChange={handleChange}
            fullWidth
            disabled
            margin="normal"
            helperText="This is an automatic update value"
          />
          <TextField
            label="Gender"
            name="gender"
            select
            value={formData.gender}
            onChange={handleChange}
            fullWidth
            margin="normal"
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
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleEditHouse}
            size="small"
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

export default EditHouseModal;
