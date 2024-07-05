import React, { useState, useEffect, useContext } from "react";
import { TextField, Button, Snackbar, Alert } from "@mui/material";
import NetworkStatusWarning from "../helpers/NetworkStatusWarning"; // Import the component
import { useLocationIP, getPlatform } from "../helpers/utils";
import { useGetSchoolItemsQuery } from "../slices/schoolApiSlice";
import { useUpdateSchoolItemMutation } from "../slices/schoolApiSlice";

const EditSchoolDetails = () => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [headMasterName, setHeadMasterName] = useState("");
  const [helpDeskNo, setHelpDeskNo] = useState("");
  const [box, setBox] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const locationIP = useLocationIP();
  const { currentUser } = true;
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const {
    data: schoolItems,
    isLoading,
    isError,
    error,
  } = useGetSchoolItemsQuery();
  const [updateSchoolItem] = useUpdateSchoolItemMutation();

  useEffect(() => {
    if (schoolItems && schoolItems.length > 0) {
      const school = schoolItems[0]; // Assuming there's only one school
      setName(school.name || "");
      setAddress(school.address || "");
      setPhone(school.phone ? school.phone.toString() : "");
      setEmail(school.email || "");
      setHeadMasterName(school.headMasterName || "");
      setHelpDeskNo(school.helpDeskNo ? school.helpDeskNo.toString() : "");
      setBox(school.box || "");
    }
  }, [schoolItems]);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  const handleSubmit = async () => {
    if (isUpdating) return;

    setIsUpdating(true);

    try {
      const updatedSchool = {
        name,
        address,
        phone: parseInt(phone),
        email,
        headMasterName,
        helpDeskNo: parseInt(helpDeskNo),
        box,
      };

      const result = await updateSchoolItem({
        id: schoolItems[0]._id,
        ...updatedSchool,
      }).unwrap();

      setSnackbarMessage("School details updated successfully!");
      setSnackbarSeverity("success");
    } catch (error) {
      console.error("Error updating school details:", error);
      setSnackbarMessage("Error updating school details: " + error.message);
      setSnackbarSeverity("error");
    } finally {
      setIsUpdating(false);
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <h4>School Details</h4>
      <div>
        <TextField
          label="Name of School"
          type="text"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          label="Address"
          type="text"
          fullWidth
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          label="Phone"
          type="text"
          fullWidth
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          label="Email"
          type="text"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          label="Head Master Name"
          type="text"
          fullWidth
          value={headMasterName}
          onChange={(e) => setHeadMasterName(e.target.value)}
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          label="Help desk No."
          type="text"
          fullWidth
          value={helpDeskNo}
          onChange={(e) => setHelpDeskNo(e.target.value)}
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          label="P. O. Box"
          type="text"
          fullWidth
          value={box}
          onChange={(e) => setBox(e.target.value)}
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          sx={{ marginBottom: "1em" }}
          disabled={isUpdating}
        >
          {isUpdating ? "Updating..." : "Update"}
        </Button>
      </div>
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

export default EditSchoolDetails;
