import React, { useState, useEffect } from "react";
import { Avatar, Typography, Button, Grid, Paper, Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Link } from "react-router-dom";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import DescriptionIcon from "@mui/icons-material/Description";
import TaskIcon from "@mui/icons-material/Task";
import ArticleIcon from "@mui/icons-material/Article";
import NetworkStatusWarning from "../helpers/NetworkStatusWarning";
import "../styles/dashboard.css";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useGetStudentDetailsMutation } from "../slices/clientApiSlice";
import { useGetProgramItemsQuery } from "../slices/programApiSlice";
import { useGetHouseItemsQuery } from "../slices/houseApiSlice";
import { useGetSchoolItemsQuery } from "../slices/schoolApiSlice";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  height: "100%",
}));

const LeftAlignedItem = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: "left",
  color: theme.palette.text.secondary,
}));

const Dashboard = () => {
  const [student, setStudent] = useState({});
  const { clientInfo } = useSelector((state) => state.auth);
  const [getStudentDetails] = useGetStudentDetailsMutation();
  const { data: programs, isLoading: programsLoading } =
    useGetProgramItemsQuery();

  const { data: houses, isLoading: housesLoading } = useGetHouseItemsQuery();
  const { data: schoolItems, isLoading: schoolLoading } =
    useGetSchoolItemsQuery();

  // In your React component
  const generateAdmissionLetter = async () => {
    try {
      const response = await fetch("/api/pdf/generate-admission-letter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ studentId: student._id }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = "admission_letter.pdf";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        console.error("Failed to generate admission letter");
      }
    } catch (error) {
      console.error("Error generating admission letter:", error);
    }
  };

  const generatePersonalRecords = async () => {
    try {
      const response = await fetch("/api/pdf/generate-personal-records", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ studentId: student._id }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = "personal_records.pdf";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        console.error("Failed to personal records letter");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getProgramName = (programId) => {
    if (!programs) return "Loading...";
    const program = programs.find((p) => p._id === programId);
    return program ? program.name : "Unknown Program";
  };

  const getHouseName = (houseId) => {
    if (!houses) return "Loading...";
    const house = houses.find((h) => h._id === houseId);
    return house ? house.name : "Unknown Program";
  };

  const getProgramShortName = (programId) => {
    if (!programs) return "...";
    const program = programs.find((p) => p._id === programId);
    return program ? program.shortName : "Unknown";
  };

  const getSchoolData = () => {
    if (!schoolItems || schoolItems.length === 0) return null;
    return schoolItems[0]; // Assuming there's only one school
  };

  const schoolData = getSchoolData();

  useEffect(() => {
    const fetchStudentDetails = async () => {
      if (clientInfo && clientInfo._id) {
        try {
          const res = await getStudentDetails(clientInfo._id).unwrap();
          setStudent(res);
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

  return (
    <>
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item xs={12} md={4}>
          <Item>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                <Avatar
                  alt="User Avatar"
                  src={student.photo}
                  sx={{ width: 100, height: 100, margin: "0 auto" }}
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Typography
                  sx={{ textTransform: "uppercase", fontWeight: "bold" }}
                >
                  {student.otherNames} {student.surname}
                </Typography>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <Typography
                  sx={{ fontSize: "smaller", fontWeight: "bold", mb: 1 }}
                >
                  Student Number: {getProgramShortName(student.program)}
                  {student.year}
                  {student.admissionNo}
                </Typography>
              </motion.div>
            </motion.div>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              size="small"
              to={"edit-student"}
            >
              Edit
            </Button>
            <Typography
              variant="body1"
              style={{
                margin: "8px 0",
                fontWeight: "bold",
                color: student.completed ? "green" : "red",
              }}
            >
              {student.completed ? "COMPLETED" : "NOT COMPLETED"}
            </Typography>
          </Item>
        </Grid>
        <Grid item xs={12} md={8}>
          <Grid
            container
            rowSpacing={2}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            sx={{ mt: { xs: 1, md: 0 } }}
          >
            <Grid item xs={12} md={6}>
              <LeftAlignedItem>
                <h5>Index Number</h5>

                <Typography variant="body1" className="info">
                  {student.indexNumber}
                </Typography>
              </LeftAlignedItem>
            </Grid>
            <Grid item xs={12} md={6}>
              <LeftAlignedItem>
                <h5>Program</h5>
                <Typography variant="body1" className="info">
                  {getProgramName(student.program)}
                </Typography>
              </LeftAlignedItem>
            </Grid>
            <Grid item xs={12} md={6}>
              <LeftAlignedItem>
                <h5>Gender</h5>
                <Typography variant="body1" className="info">
                  {student.gender}
                </Typography>
              </LeftAlignedItem>
            </Grid>

            <Grid item xs={12} md={6}>
              <LeftAlignedItem>
                <h5>Residential Status</h5>
                <Typography
                  variant="body1"
                  sx={{ textTransform: "capitalize" }}
                  className="info"
                >
                  {student.status}
                </Typography>
              </LeftAlignedItem>
            </Grid>
            <Grid item xs={12} md={6}>
              <LeftAlignedItem>
                <h5>House</h5>
                <Typography variant="body1" className="info">
                  {getHouseName(student.house)}
                </Typography>
              </LeftAlignedItem>
            </Grid>
            <Grid item xs={12} md={6}>
              <LeftAlignedItem>
                <h5>Year</h5>
                <Typography variant="body1" className="info">
                  {student.year}
                </Typography>
              </LeftAlignedItem>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sx={{ mt: 4 }}>
          <LeftAlignedItem>
            <a
              href={getSchoolData()?.prospectus}
              target="_blank"
              rel="noopener noreferrer"
              download
            >
              <Button
                variant="outlined"
                color="primary"
                disabled={!getSchoolData()?.prospectus}
              >
                <ArticleIcon />
                Download Prospectus
              </Button>
            </a>
          </LeftAlignedItem>
        </Grid>
        <Grid item xs={12}>
          <LeftAlignedItem>
            <Button
              variant="outlined"
              onClick={generateAdmissionLetter}
              color="error"
            >
              <TaskIcon />
              Download Admission Letter
            </Button>
          </LeftAlignedItem>
        </Grid>
        <Grid item xs={12}>
          <LeftAlignedItem>
            <Button
              variant="outlined"
              onClick={generatePersonalRecords}
              color="secondary"
            >
              <DescriptionIcon />
              Downlaod Personal Records
            </Button>
          </LeftAlignedItem>
        </Grid>
        <Grid item xs={12}>
          <LeftAlignedItem>
            <a
              href={getSchoolData()?.undertaking}
              target="_blank"
              rel="noopener noreferrer"
              download
            >
              <Button
                variant="outlined"
                color="success"
                disabled={!getSchoolData()?.undertaking}
              >
                <InsertDriveFileIcon />
                Download Undertaking
              </Button>
            </a>
          </LeftAlignedItem>
        </Grid>

        <Box sx={{ ml: 5 }}>
          <h5
            style={{
              margin: "1rem 0",
            }}
          >
            Announcements:
          </h5>
          <ol style={{ margin: "1em 0" }}>
            {schoolData
              ? schoolData.announcement.map((announcement, index) => (
                  <li key={index}>{announcement}</li>
                ))
              : ""}
          </ol>
        </Box>
      </Grid>
      <NetworkStatusWarning />
    </>
  );
};

export default Dashboard;
