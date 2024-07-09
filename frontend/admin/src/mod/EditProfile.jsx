import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useUpdateUserProfileMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import { useLocationIP, useCreateLog } from "../helpers/utils";

const EditProfile = ({ open, onClose, user }) => {
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);
  const createLog = useCreateLog();
  const { locationIP, loading: ipLoading } = useLocationIP();

  const dispatch = useDispatch();
  const [updateProfile, { isLoading }] = useUpdateUserProfileMutation();

  const handleSubmit = async (e) => {
    console.log(name, email, password, phone);
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }
    try {
      const res = await updateProfile({
        _id: user._id,
        name,
        email,
        phone,
        password,
      }).unwrap();
      dispatch(setCredentials({ ...res }));

      if (!ipLoading) {
        await createLog("User Profile updated", res._id, locationIP);
      } else {
        console.log("IP address not available yet");
      }

      setMessage("Profile updated successfully");
      onClose();
    } catch (err) {
      setMessage(err?.data?.message || err.error);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle color={"primary"} sx={{ fontWeight: "bold" }}>
          PROFILE
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
              />
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
              />
              <TextField
                label="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                fullWidth
              />
              <TextField
                label="New Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
              />
              <TextField
                label="Confirm New Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                fullWidth
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button color="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Update Profile"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      <Snackbar
        open={!!message}
        autoHideDuration={6000}
        onClose={() => setMessage(null)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setMessage(null)}
          severity={message?.includes("successfully") ? "success" : "error"}
        >
          {message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default EditProfile;
