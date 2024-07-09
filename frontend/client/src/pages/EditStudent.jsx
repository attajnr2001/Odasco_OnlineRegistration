import React, { useState, useEffect } from "react";
import {
  TextField,
  Snackbar,
  Alert,
  MenuItem,
  Button,
  Avatar,
  IconButton,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { motion, AnimatePresence } from "framer-motion";
import { Camera } from "@mui/icons-material";
import { useParams } from "react-router-dom";
import NetworkStatusWarning from "../helpers/NetworkStatusWarning";
import {
  districts,
  regions,
  churches,
  validNationalities,
} from "../helpers/constants";
import "../styles/editStudent.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useGetStudentDetailsMutation } from "../slices/clientApiSlice";
import { useGetProgramItemsQuery } from "../slices/programApiSlice";
import { useGetHouseItemsQuery } from "../slices/houseApiSlice";
import { useUpdateStudentItemMutation } from "../slices/studentApiSlice";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useUpdateHouseItemMutation } from "../slices/houseApiSlice";
import { storage } from "../helpers/firebase";

const EditStudent = () => {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [indexNumber, setIndexNumber] = useState("");
  const [selectedHouse, setSelectedHouse] = useState("");
  const [rawScore, setRawScore] = useState("");
  const [enrollmentCode, setEnrollmentCode] = useState("");
  const [enrollmentForm, setEnrollmentForm] = useState("");
  const [jhsAttended, setJhsAttended] = useState("");
  const [jhsType, setJhsType] = useState("");
  const [photo, setPhoto] = useState("");
  const [placeOfBirth, setPlaceOfBirth] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [religion, setReligion] = useState("");
  const [religiousDenomination, setReligiousDenomination] = useState("");
  const [permanentAddress, setPermanentAddress] = useState("");
  const [town, setTown] = useState("");
  const [region, setRegion] = useState("");
  const [district, setDistrict] = useState("");
  const [interest, setInterest] = useState("");
  const [ghanaCardNumber, setGhanaCardNumber] = useState("");
  const [nHISNumber, setNHISNumber] = useState("");
  const [mobilePhone, setMobilePhone] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [email, setEmail] = useState("");
  const [fathersName, setFathersName] = useState("");
  const [fathersOccupation, setFathersOccupation] = useState("");
  const [mothersName, setMothersName] = useState("");
  const [mothersOccupation, setMothersOccupation] = useState("");
  const [guardian, setGuardian] = useState("");
  const [residentialTelephone, setResidentialTelephone] = useState("");
  const [digitalAddress, setDigitalAddress] = useState("");
  const [nationality, setNationality] = useState("Ghana");
  const [file, setFile] = useState(null);
  const [form, setForm] = useState(null);
  const [previewURL, setPreviewURL] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [showPersonalRecords, setShowPersonalRecords] = useState(false);
  const [photoUploaded, setPhotoUploaded] = useState(true); // New state
  const navigate = useNavigate();
  const [updateStudentItem, { isLoading: isUpdating }] =
    useUpdateStudentItemMutation();

  const [student, setStudent] = useState({});
  const { clientInfo } = useSelector((state) => state.auth);
  const [getStudentDetails] = useGetStudentDetailsMutation();
  const { data: programs, isLoading: programsLoading } =
    useGetProgramItemsQuery();

  const { data: houses, isLoading: housesLoading } = useGetHouseItemsQuery();
  const [updateHouseItem] = useUpdateHouseItemMutation();

  const getProgramName = (programId) => {
    if (!programs) return "Loading...";
    const program = programs.find((p) => p._id === programId);
    return program ? program.name : "Unknown Program";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0]; // This will give you 'yyyy-MM-dd'
  };

  const getHouseName = (houseId) => {
    if (!houses) return "Loading...";
    const house = houses.find((h) => h._id === houseId);
    return house ? house.name : "Unknown Program";
  };

  useEffect(() => {
    const fetchStudentDetails = async () => {
      if (clientInfo && clientInfo._id) {
        try {
          const res = await getStudentDetails(clientInfo._id).unwrap();
          setStudent(res);
          setRawScore(res.rawScore);
          setEnrollmentCode(res.enrollmentCode);
          setPhoto(res.photo);
          setPlaceOfBirth(res.placeOfBirth);
          setDigitalAddress(res.digitalAddress);
          setDateOfBirth(formatDate(res.dateOfBirth));
          setDistrict(res.district);
          setEmail(res.email);
          setEnrollmentForm(res.enrollmentForm);
          setFathersName(res.fathersName);
          setFathersOccupation(res.fathersOccupation);
          setGhanaCardNumber(res.ghanaCardNumber);
          setGuardian(res.guardian);
          setInterest(res.interest);
          setJhsAttended(res.jhsAttended);
          setJhsType(res.jhsType);
          setMobilePhone(res.mobilePhone);
          setMothersName(res.mothersName);
          setMothersOccupation(res.mothersOccupation);
          setNHISNumber(res.nHISNumber);
          setNationality(res.nationality);
          setPermanentAddress(res.permanentAddress);
          setPhoto(res.photo);
          setRegion(res.region);
          setReligion(res.religion);
          setReligiousDenomination(res.religiousDenomination);
          setResidentialTelephone(res.residentialTelephone);
          setTown(res.town);
          setWhatsappNumber(res.whatsappNumber);
        } catch (err) {
          console.error("Failed to fetch student details:", err);
          if (err.status === 404) {
            console.error("Student not found");
            // Handle 404 error (e.g., show a message to the user)
          } else {
            console.error("An unexpected error occurred");
            // Handle other types of errors
          }
        }
      }
    };

    fetchStudentDetails();
  }, [clientInfo, getStudentDetails]);

  const toggleWidgets = () => {
    setShowPersonalRecords(!showPersonalRecords);
  };

  // uploading student profile picture in firestore

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 1.5 * 1024 * 1024) {
        setSnackbarMessage(
          "File size exceeds 1.5MB. Please choose a smaller image."
        );
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
        e.target.value = "";
      } else {
        setFile(selectedFile);
        const objectURL = URL.createObjectURL(selectedFile);
        setPreviewURL(objectURL);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (previewURL) {
        URL.revokeObjectURL(previewURL);
      }
    };
  }, [previewURL]);

  const handleSaveChanges = async () => {
    try {
      setIsSaving(true);

      if (!student.hasPaid) {
        setSnackbarMessage("Please Make payment first");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
        return;
      }

      let photoURL = photo;
      let enrollmentFormURL = enrollmentForm;

      // Upload photo if a new file is selected
      if (file) {
        const photoRef = ref(storage, `studentPhotos/${clientInfo._id}`);
        await uploadBytes(photoRef, file);
        photoURL = await getDownloadURL(photoRef);
      }

      // Upload enrollment form if a new file is selected
      if (form) {
        const formRef = ref(storage, `enrollmentForms/${clientInfo._id}`);
        await uploadBytes(formRef, form);
        enrollmentFormURL = await getDownloadURL(formRef);
      }

      let houseToAssign = selectedHouse;

      if (!houseToAssign) {
        const matchingHouses = houses.filter(
          (house) => house.gender === student.gender
        );

        if (matchingHouses.length > 0) {
          const randomIndex = Math.floor(Math.random() * matchingHouses.length);
          houseToAssign = matchingHouses[randomIndex]._id;
        }
      }

      const updatedStudentData = {
        id: clientInfo._id,
        rawScore,
        enrollmentCode,
        enrollmentForm: enrollmentFormURL,
        photo: photoURL,
        jhsAttended,
        jhsType,
        placeOfBirth,
        dateOfBirth,
        nationality,
        religion,
        religiousDenomination,
        permanentAddress,
        town,
        region,
        district,
        interest,
        ghanaCardNumber,
        nHISNumber,
        mobilePhone,
        whatsappNumber,
        email,
        fathersName,
        fathersOccupation,
        mothersName,
        mothersOccupation,
        guardian,
        residentialTelephone,
        digitalAddress,
        completed: true,
        house: houseToAssign,
      };

      const result = await updateStudentItem(updatedStudentData).unwrap();

      if (houseToAssign) {
        const assignedHouse = houses.find(
          (house) => house._id === houseToAssign
        );
        if (assignedHouse) {
          await updateHouseItem({
            id: houseToAssign,
            noOfStudents: assignedHouse.noOfStudents + 1,
          }).unwrap();
        }
      }

      setSnackbarMessage("Student information updated successfully");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);

      // Optionally, you can update the local state with the returned data
      setStudent(result);
      navigate("/dashboard");
    } catch (err) {
      setSnackbarMessage("Failed to update student information");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      console.error("Failed to update student:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleFormFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setForm(selectedFile);
    }
  };

  return (
    <div className="edit-student">
      <p className="title">
        PREVIOUS DETAILS
        <IconButton onClick={toggleWidgets} sx={{ p: 0 }}>
          {showPersonalRecords ? <VisibilityOffIcon /> : <VisibilityIcon />}
        </IconButton>
      </p>
      <form className="edit-form">
        <AnimatePresence>
          {showPersonalRecords && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <TextField
                required
                label="Index Number"
                variant="outlined"
                fullWidth
                margin="normal"
                value={student.indexNumber}
                disabled
                onChange={(e) => setIndexNumber(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                required
                label="Gender"
                name="gender"
                fullWidth
                margin="normal"
                value={student.gender}
                disabled
                InputLabelProps={{
                  shrink: true,
                }}
              />

              <TextField
                required
                label="Program"
                variant="outlined"
                fullWidth
                margin="normal"
                disabled
                value={getProgramName(student.program)}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                required
                label="Residential Status"
                variant="outlined"
                fullWidth
                margin="normal"
                disabled
                value={student.status}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                required
                label="Surname"
                variant="outlined"
                fullWidth
                margin="normal"
                disabled
                value={student.surname}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                required
                label="Other Names"
                variant="outlined"
                fullWidth
                margin="normal"
                disabled
                value={student.otherNames}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                required
                label="Aggregate of Best 6"
                variant="outlined"
                fullWidth
                margin="normal"
                disabled
                value={student.aggregate}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <p className="title">ENROLLMENT DETAILS</p>
        <TextField
          type="number"
          required
          label="Raw Score"
          variant="outlined"
          value={rawScore}
          onChange={(e) => setRawScore(e.target.value)}
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          required
          label="Enrollment Code"
          value={enrollmentCode}
          onChange={(e) => setEnrollmentCode(e.target.value)}
          variant="outlined"
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          required
          label="Enrollment Form"
          variant="outlined"
          type="file"
          fullWidth
          margin="normal"
          onChange={handleFormFileChange}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <a
          href={student.enrollmentForm}
          download
          target="_blank"
          style={{
            fontSize: "smaller",
            color: "blue",
          }}
        >
          Download Enrollment Form
        </a>

        <TextField
          required
          label="JHS Attended"
          variant="outlined"
          fullWidth
          margin="normal"
          value={jhsAttended}
          onChange={(e) => setJhsAttended(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />

        <TextField
          required
          label="JHS Type"
          name="jhsType"
          select
          value={jhsType}
          onChange={(e) => setJhsType(e.target.value)}
          fullWidth
          margin="normal"
        >
          {["Public", "Private"].map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>

        <p className="title">PERSONAL RECORDS</p>

        <div>
          <Avatar
            sx={{ width: "100px", height: "100px", marginBottom: "10px" }}
            src={previewURL == "" ? photo : previewURL}
            alt="Student Photo"
          />
          <input
            accept="image/*"
            id="icon-button-file"
            type="file"
            style={{ display: "none" }}
            onChange={handleFileChange}
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
        </div>
        <TextField
          required
          label="Place of Birth"
          variant="outlined"
          fullWidth
          margin="normal"
          value={placeOfBirth}
          onChange={(e) => setPlaceOfBirth(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />

        <TextField
          required
          label="Date of Birth"
          type="date"
          fullWidth
          margin="normal"
          value={dateOfBirth}
          onChange={(e) => setDateOfBirth(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />

        <TextField
          label="Nationality"
          select
          value={nationality}
          onChange={(e) => setNationality(e.target.value)}
          fullWidth
          margin="normal"
        >
          {validNationalities.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          required
          label="Religion"
          name="religion"
          select
          value={religion}
          onChange={(e) => setReligion(e.target.value)}
          fullWidth
          margin="normal"
        >
          {["Christianity", "Islamic", "Tradionalist", "Atheist", "Other"].map(
            (option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            )
          )}
        </TextField>

        <TextField
          required
          label="Religious Denomination"
          name="religiousDenomination"
          select
          value={religiousDenomination}
          onChange={(e) => setReligiousDenomination(e.target.value)}
          fullWidth
          margin="normal"
          disabled={religion !== "Christianity"}
          helperText={
            religion !== "Christianity" ? "Only applicable for Christians" : ""
          }
        >
          {churches.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          required
          label="Permanent Address"
          variant="outlined"
          fullWidth
          margin="normal"
          value={permanentAddress}
          onChange={(e) => setPermanentAddress(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />

        <TextField
          required
          label="Town"
          variant="outlined"
          fullWidth
          margin="normal"
          value={town}
          onChange={(e) => setTown(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />

        <TextField
          required
          label="Region"
          name="region"
          select
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          fullWidth
          margin="normal"
        >
          {regions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          required
          label="District"
          name="district"
          select
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
          fullWidth
          margin="normal"
        >
          {districts.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          required
          label="Interest"
          name="interest"
          select
          fullWidth
          margin="normal"
          value={interest}
          onChange={(e) => setInterest(e.target.value)}
        >
          {["Football", "Drama", "Quiz"].map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          type="number"
          required
          label="Ghana Card Number"
          variant="outlined"
          fullWidth
          margin="normal"
          value={ghanaCardNumber}
          onChange={(e) => setGhanaCardNumber(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />

        <TextField
          type="number"
          required
          label="NHIS Number"
          variant="outlined"
          fullWidth
          margin="normal"
          value={nHISNumber}
          onChange={(e) => setNHISNumber(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />

        <p className="title">COMMUNICATIONS DETAILS</p>
        <TextField
          required
          label="Mobile Phone (SMS)"
          variant="outlined"
          fullWidth
          margin="normal"
          value={mobilePhone}
          onChange={(e) => setMobilePhone(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          required
          label="WhatsApp Number"
          variant="outlined"
          fullWidth
          margin="normal"
          value={whatsappNumber}
          onChange={(e) => setWhatsappNumber(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          required
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          required
          label="Father's Name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={fathersName}
          onChange={(e) => setFathersName(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          required
          label="Father's Occupation"
          variant="outlined"
          fullWidth
          margin="normal"
          value={fathersOccupation}
          onChange={(e) => setFathersOccupation(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          required
          label="Mother's Name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={mothersName}
          onChange={(e) => setMothersName(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          required
          label="Mother's Occupation"
          variant="outlined"
          fullWidth
          margin="normal"
          value={mothersOccupation}
          onChange={(e) => setMothersOccupation(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          required
          label="Guardian"
          variant="outlined"
          fullWidth
          margin="normal"
          value={guardian}
          onChange={(e) => setGuardian(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          required
          type="number"
          label="Residential Telephone"
          variant="outlined"
          fullWidth
          margin="normal"
          value={residentialTelephone}
          onChange={(e) => setResidentialTelephone(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          required
          label="Digital Address"
          variant="outlined"
          fullWidth
          margin="normal"
          value={digitalAddress}
          onChange={(e) => setDigitalAddress(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />

        <Button
          variant="contained"
          color="primary"
          onClick={handleSaveChanges}
          disabled={isSaving || isUpdating || !photoUploaded}
          sx={{ mb: 3 }}
        >
          {isSaving || isUpdating ? "Saving..." : "Save Changes"}
        </Button>
      </form>

      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert severity={snackbarSeverity}>{snackbarMessage}</Alert>
      </Snackbar>
      <NetworkStatusWarning />
    </div>
  );
};

export default EditStudent;
