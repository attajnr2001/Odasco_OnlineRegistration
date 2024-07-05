import React, { useState, useEffect, useContext } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Alert,
  Grid,
  Snackbar,
} from "@mui/material";
import NetworkStatusWarning from "../helpers/NetworkStatusWarning";
import { useParams } from "react-router-dom";
import { useLocationIP, getPlatform } from "../helpers/utils";

import { useGetSchoolItemsQuery } from "../slices/schoolApiSlice";
import { useUpdateSchoolItemMutation } from "../slices/schoolApiSlice";

const EditAdmissionDetails = () => {
  const [admissionData, setAdmissionData] = useState({
    senderID: "",
    year: "",
    admissionOpeningDateTime: null, // auto datetime time to determine admission opened or closed
    academicYear: "",
    acceptOnlinePayment: false,
    serviceCharge: "",
    allowUploadPictures: false,
    autoStudentHousing: false,
    allowStudentClassSelection: false,
    admissionStatus: false,
    announcement: "",
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [reOpeningDate, setReOpeningDate] = useState("");
  const [schOpeningDate, setSchOpeningDate] = useState("");
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertSeverity, setAlertSeverity] = useState("success");
  const [announcementTextFields, setAnnouncementTextFields] = useState([
    { value: "" },
  ]);
  const [admissionOpeningDateTime, setAdmissionOpeningDateTime] = useState("");
  const [schOpeningDateTime, setSchOpeningDateTime] = useState("");
  const [announcements, setAnnouncements] = useState([]);

  const handleAddAnnouncement = () => {
    setAnnouncements([...announcements, ""]);
  };

  const handleRemoveAnnouncement = (index) => {
    setAnnouncements(announcements.filter((_, i) => i !== index));
  };

  const handleAnnouncementChange = (index, value) => {
    const newAnnouncements = [...announcements];
    newAnnouncements[index] = value;
    setAnnouncements(newAnnouncements);
  };

  const locationIP = useLocationIP();

  const {
    data: schoolItems,
    isLoading,
    isError,
    error,
  } = useGetSchoolItemsQuery();
  const [updateSchoolItem] = useUpdateSchoolItemMutation();

  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16); // This will return "YYYY-MM-DDTHH:mm"
  };

  useEffect(() => {
    if (schoolItems && schoolItems.length > 0) {
      const school = schoolItems[0];
      setAdmissionData((prevData) => ({
        ...prevData,
        senderID: school.senderID || "",
        year: school.year || "",
        academicYear: school.academicYear || "",
        acceptOnlinePayment: school.acceptOnlinePayment || "",
        serviceCharge: school.serviceCharge || "",
        allowUploadPictures: school.allowUploadPictures || "",
        autoStudentHousing: school.autoStudentHousing || "",
        allowStudentClassSelection: school.allowStudentClassSelection || "",
        admissionStatus: school.admissionStatus || "",
        // ... other fields ...
      }));
      setAnnouncements(school.announcement || []);
      setAdmissionOpeningDateTime(
        formatDateForInput(school.admissionOpeningDateTime)
      );
      setSchOpeningDateTime(formatDateForInput(school.schOpeningDateTime));
    }
  }, [schoolItems]);

  const handleSubmit = async () => {
    if (isUpdating) return;

    setIsUpdating(true);

    if (!schoolItems || schoolItems.length === 0) {
      setAlertMessage("No school data available to update");
      setAlertSeverity("error");
      setSnackbarOpen(true);
      setIsUpdating(false);
      return;
    }

    try {
      const updatedSchool = {
        senderID: admissionData.senderID,
        year: admissionData.year,
        admissionOpeningDateTime: new Date(
          admissionOpeningDateTime
        ).toISOString(),
        schOpeningDateTime: new Date(schOpeningDateTime).toISOString(),
        academicYear: admissionData.academicYear,
        acceptOnlinePayment: admissionData.acceptOnlinePayment,
        serviceCharge: admissionData.serviceCharge,
        allowUploadPictures: admissionData.allowUploadPictures,
        autoStudentHousing: admissionData.autoStudentHousing,
        allowStudentClassSelection: admissionData.allowStudentClassSelection,
        admissionStatus: admissionData.admissionStatus,
        announcement: announcements.filter((a) => a.trim() !== ""), // Remove empty announcements
      };

      const result = await updateSchoolItem({
        id: schoolItems[0]._id,
        ...updatedSchool,
      }).unwrap();

      setAlertMessage("School details updated successfully!");
      setAlertSeverity("success");
    } catch (error) {
      console.error("Error updating school details:", error);
      setAlertMessage("Error updating school details: " + error.message);
      setAlertSeverity("error");
    } finally {
      setIsUpdating(false);
      setSnackbarOpen(true);
    }
  };

  const handleTextFieldChange = (field, value) => {
    setAdmissionData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleSelectChange = (fieldName, value) => {
    setAdmissionData((prevData) => ({
      ...prevData,
      [fieldName]: value === "Yes" ? true : false,
    }));
  };

  return (
    <>
      <h4>Admission Details</h4>

      <div>
        <TextField
          label="SHS Sender ID"
          type="text"
          fullWidth
          value={admissionData.senderID}
          onChange={(e) => handleTextFieldChange("senderID", e.target.value)}
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
        />

        <TextField
          label="Admission Year"
          type="text"
          fullWidth
          value={admissionData.year}
          onChange={(e) => handleTextFieldChange("year", e.target.value)}
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
        />

        <TextField
          label="Academic Year"
          type="text"
          fullWidth
          value={admissionData.academicYear}
          onChange={(e) =>
            handleTextFieldChange("academicYear", e.target.value)
          }
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
        />

        <TextField
          label="Accept Online Payment"
          select
          fullWidth
          value={admissionData.acceptOnlinePayment ? "Yes" : "No"}
          onChange={(e) =>
            handleSelectChange("acceptOnlinePayment", e.target.value)
          }
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
        >
          {["Yes", "No"].map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Service Charge"
          type="number"
          fullWidth
          value={admissionData.serviceCharge}
          onChange={(e) =>
            handleTextFieldChange("serviceCharge", e.target.value)
          }
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
        />

        <TextField
          label="Allow Upload of passport pictures"
          select
          fullWidth
          value={admissionData.allowUploadPictures ? "Yes" : "No"}
          onChange={(e) =>
            handleSelectChange("allowUploadPictures", e.target.value)
          }
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
        >
          {["Yes", "No"].map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Automatic Housing Selection"
          select
          fullWidth
          value={admissionData.autoStudentHousing ? "Yes" : "No"}
          onChange={(e) =>
            handleSelectChange("autoStudentHousing", e.target.value)
          }
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
        >
          {["Yes", "No"].map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Student Classroom Selection"
          select
          fullWidth
          value={admissionData.allowStudentClassSelection ? "Yes" : "No"}
          onChange={(e) =>
            handleSelectChange("allowStudentClassSelection", e.target.value)
          }
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
        >
          {["Yes", "No"].map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Admission Opening Date and Time"
          type="datetime-local"
          fullWidth
          value={admissionOpeningDateTime}
          onChange={(e) => setAdmissionOpeningDateTime(e.target.value)}
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
        />

        <TextField
          label="School Opening Date and Time"
          type="datetime-local"
          fullWidth
          value={schOpeningDateTime}
          onChange={(e) => setSchOpeningDateTime(e.target.value)}
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
        />

        <TextField
          label="Admission Opened"
          select
          fullWidth
          value={admissionData.admissionStatus ? "Yes" : "No"}
          onChange={(e) =>
            handleSelectChange("admissionStatus", e.target.value)
          }
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
        >
          {["Yes", "No"].map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>

        <Grid
          container
          alignItems="center"
          style={{ marginTop: "1rem" }}
          spacing={1}
        >
          {announcements.map((announcement, index) => (
            <React.Fragment key={index}>
              <Grid item xs={9}>
                <TextField
                  label={`Announcement ${index + 1}`}
                  type="text"
                  fullWidth
                  value={announcement}
                  onChange={(e) =>
                    handleAnnouncementChange(index, e.target.value)
                  }
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={1}>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleRemoveAnnouncement(index)}
                  sx={{ mb: { xs: 2, md: 0 } }}
                >
                  -
                </Button>
              </Grid>
            </React.Fragment>
          ))}
          <Grid item xs={12} sm={1}>
            <Button
              sx={{ mb: { xs: 2, md: 0 } }}
              variant="contained"
              color="primary"
              onClick={handleAddAnnouncement}
            >
              +
            </Button>
          </Grid>
        </Grid>

        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          sx={{ marginBottom: "1em" }}
          disabled={isUpdating}
        >
          {isUpdating ? "Updating..." : "Update"}
        </Button>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={() => setSnackbarOpen(false)}
            severity={alertSeverity}
          >
            {alertMessage}
          </Alert>
        </Snackbar>
      </div>
      <NetworkStatusWarning />
    </>
  );
};

export default EditAdmissionDetails;
