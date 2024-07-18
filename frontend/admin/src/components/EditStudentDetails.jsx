import React, { useState, useEffect, useContext } from "react";
import { TextField, Button, MenuItem, Alert, Snackbar } from "@mui/material";
import NetworkStatusWarning from "../helpers/NetworkStatusWarning"; // Import the component
import { useLocationIP, useCreateLog } from "../helpers/utils";
import { useGetSchoolItemsQuery } from "../slices/schoolApiSlice";
import { useUpdateSchoolItemMutation } from "../slices/schoolApiSlice";

const EditStudentDetails = () => {
  const [studentData, setStudentData] = useState({
    showMedicalUndertaking: false,
    showProgramSubject: false,
    personalRecordsCaption: "",
    UndertakingMedicalCaption: "",
    programSubjectCaption: "",
    notes: "",
  });
  const { locationIP, loading: ipLoading } = useLocationIP();
  const createLog = useCreateLog();
  const {
    data: schoolItems,
    isLoading,
    isError,
    error,
  } = useGetSchoolItemsQuery();
  const [updateSchoolItem] = useUpdateSchoolItemMutation();

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const { currentUser } = true;
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertSeverity, setAlertSeverity] = useState("success");

  useEffect(() => {
    if (schoolItems && schoolItems.length > 0) {
      const school = schoolItems[0];
      setStudentData((prevData) => ({
        ...prevData,
        showMedicalUndertaking: school.showMedicalUndertaking || "",
        notes: school.notes || "",
        showProgramSubject: school.showProgramSubject || "",
        personalRecordsCaption: school.personalRecordsCaption || "",
        undertakingMedicalCaption: school.undertakingMedicalCaption || "",
        programSubjectCaption: school.programSubjectCaption || "",

        // ... other fields ...
      }));
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
        showMedicalUndertaking: studentData.showMedicalUndertaking || "",
        notes: studentData.notes || "",
        showProgramSubject: studentData.showProgramSubject || "",
        personalRecordsCaption: studentData.personalRecordsCaption || "",
        undertakingMedicalCaption: studentData.undertakingMedicalCaption || "",
        programSubjectCaption: studentData.programSubjectCaption || "",
      };

      const result = await updateSchoolItem({
        id: schoolItems[0]._id,
        ...updatedSchool,
      }).unwrap();

      // Add log entry
      if (!ipLoading) {
        await createLog(
          "Student Details Updated",
          schoolItems[0]._id,
          locationIP
        );
      } else {
        console.log("IP address not available yet");
      }

      setAlertMessage("Student details updated successfully!");
      setAlertSeverity("success");
    } catch (error) {
      console.error("Error updating student details:", error);
      setAlertMessage("Error updating student details: " + error.message);
      setAlertSeverity("error");
    } finally {
      setIsUpdating(false);
      setSnackbarOpen(true);
    }
  };

  const handleTextFieldChange = (fieldName, value) => {
    setStudentData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));
  };

  const handleSelectChange = (fieldName, value) => {
    setStudentData((prevData) => ({
      ...prevData,
      [fieldName]: value === "Yes" ? true : false,
    }));
  };

  return (
    <>
      <h4>Student Details</h4>
      <div>
        <TextField
          label="Show Undertaking/Medical Forms"
          select
          fullWidth
          value={studentData.showMedicalUndertaking ? "Yes" : "No"}
          onChange={(e) =>
            handleSelectChange("showMedicalUndertaking", e.target.value)
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
          label="Show Program/Subject Combination"
          select
          fullWidth
          value={studentData.showProgramSubject ? "Yes" : "No"}
          onChange={(e) =>
            handleSelectChange("showProgramSubject", e.target.value)
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
          label="Caption for Personal Records Form"
          type="text"
          fullWidth
          value={studentData.personalRecordsCaption}
          onChange={(e) =>
            handleTextFieldChange("personalRecordsCaption", e.target.value)
          }
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
        />

        <TextField
          label="Caption for Undertaking/Medical Form"
          type="text"
          fullWidth
          value={studentData.UndertakingMedicalCaption}
          onChange={(e) =>
            handleTextFieldChange("UndertakingMedicalCaption", e.target.value)
          }
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
        />

        <TextField
          label="Caption for Program/Subject Combination"
          type="text"
          fullWidth
          value={studentData.programSubjectCaption}
          onChange={(e) =>
            handleTextFieldChange("programSubjectCaption", e.target.value)
          }
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
        />

        <TextField
          label="Notes"
          fullWidth
          value={studentData.notes}
          onChange={(e) => handleTextFieldChange("notes", e.target.value)}
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={isUpdating}
          sx={{ marginBottom: "1em" }}
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

export default EditStudentDetails;
