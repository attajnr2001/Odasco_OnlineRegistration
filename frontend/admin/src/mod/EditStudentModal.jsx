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
  Snackbar,
} from "@mui/material";
import { db, storage, auth } from "../helpers/firebase";
import {
  doc,
  getDoc,
  updateDoc,
  onSnapshot,
  query,
  collection,
  addDoc,
  where,
} from "firebase/firestore";
import NetworkStatusWarning from "../helpers/NetworkStatusWarning"; // Import the component

import { Camera } from "@mui/icons-material";
import { useParams } from "react-router-dom";
import { useLocationIP, getPlatform } from "../helpers/utils";

const EditStudentModal = ({ open, onClose }) => {
  const [file, setFile] = useState("");
  const [formData, setFormData] = useState({
    indexNumber: "",
    house: "",
    firstName: "",
    lastName: "",
    program: "",
    year: "",
    status: "",
    image: "",
  });
  const [perc, setPerc] = useState("");
  const [uploading, setUploading] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success"); // Add state for alert severity
  const [isSaving, setIsSaving] = useState(false); // Add state to manage save button disable state
  const locationIP = useLocationIP();

  const handleAlertClose = () => {
    setAlertMessage(""); // Clear alert message
  };

  const handleSave = (e) => {
    e.preventDefault();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Student</DialogTitle>
      <DialogContent>
        <Box>
          <Avatar
            sx={{ width: "100px", height: "100px", marginBottom: "10px" }}
            src={formData.image || ""}
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
          value={formData.indexNumber} // Populate value from state
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
          value={formData.house} // Populate value from state
          onChange={(e) => setFormData({ ...formData, house: e.target.value })}
        >
          <MenuItem key={"houseId"} value={"houseId"}>
            Hello
          </MenuItem>
        </TextField>
        <TextField
          label="First Name"
          name="firstName"
          fullWidth
          margin="normal"
          value={formData.firstName} // Populate value from state
          onChange={(e) =>
            setFormData({ ...formData, firstName: e.target.value })
          }
        />
        <TextField
          label="Last Name"
          name="lastName"
          fullWidth
          margin="normal"
          value={formData.lastName} // Populate value from state
          onChange={(e) =>
            setFormData({ ...formData, lastName: e.target.value })
          }
        />
        <TextField
          select
          label="Program"
          name="program"
          fullWidth
          margin="normal"
          value={formData.program} // Populate value from state
          onChange={(e) =>
            setFormData({ ...formData, program: e.target.value })
          }
        >
          <MenuItem key={"programId"} value={"programId"}>
            Programs
          </MenuItem>
        </TextField>
        <TextField
          label="Year"
          name="year"
          type="number"
          fullWidth
          margin="normal"
          value={formData.year} // Populate value from state
          onChange={(e) => setFormData({ ...formData, year: e.target.value })}
        />
        <TextField
          select
          label="Status"
          name="status"
          fullWidth
          margin="normal"
          value={formData.status} // Populate value from state
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
        >
          <MenuItem value="boarding">Boarding</MenuItem>
          <MenuItem value="day">Day</MenuItem>
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
          disabled={isSaving || uploading}
        >
          {isSaving || uploading ? "Saving" : "Save"}
        </Button>
      </DialogActions>
      <Snackbar
        open={!!alertMessage}
        autoHideDuration={6000}
        onClose={handleAlertClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        message={alertMessage}
      />
      <NetworkStatusWarning />
    </Dialog>
  );
};

export default EditStudentModal;
