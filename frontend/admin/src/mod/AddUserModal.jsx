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
import { useParams } from "react-router-dom";
import { useLocationIP, getPlatform } from "../helpers/utils";
import { useAddUserMutation } from "../slices/usersApiSlice";

const AddUserModal = ({ open, onClose, onAddUser }) => {
  const [error, setError] = useState(null);
  const locationIP = useLocationIP();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [currentDateTime, setCurrentDateTime] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const [addUser] = useAddUserMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !role || !phone || !password) {
      setSnackbarMessage("Please fill all required fields");
      setSnackbarSeverity("warning");
      setOpenSnackbar(true);
      return;
    }
    try {
      await addUser({ name, email, password, role, phone }).unwrap(); // Include role in the mutation
      setSnackbarMessage("User added successfully");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      onClose();
    } catch (err) {
      console.error("Failed to add user:", err);
      setSnackbarMessage("Failed to add user");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };
  useEffect(() => {
    if (open) {
      setEmail("");
      setName("");
      setRole("");
      setPhone("");
    }
  }, [open]);

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleRoleChange = (event) => {
    setRole(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handlePhoneChange = (event) => {
    setPhone(event.target.value);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add New User</DialogTitle>
      <DialogContent>
        <TextField
          required
          label="Email"
          type="email"
          fullWidth
          margin="normal"
          value={email}
          onChange={handleEmailChange}
        />
        <TextField
          required
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={handlePasswordChange}
        />
        <TextField
          required
          label="Full Name"
          type="text"
          fullWidth
          margin="normal"
          value={name}
          onChange={handleNameChange}
        />
        <TextField
          required
          label="Role"
          name="role"
          select
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
          value={role}
          onChange={handleRoleChange}
        >
          {["super", "admin"].map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          required
          label="Phone Number"
          type="text"
          fullWidth
          margin="normal"
          value={phone}
          onChange={handlePhoneChange}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={isAdding}
        >
          {isAdding ? "Adding..." : "Add User"}
        </Button>
      </DialogContent>
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
    </Dialog>
  );
};

export default AddUserModal;
