import {
  Box,
  Typography,
  Button,
  Avatar,
  CircularProgress,
} from "@mui/material";
import { Link } from "react-router-dom";
import React from "react";
import NetworkStatusWarning from "../helpers/NetworkStatusWarning";
import { useGetSchoolItemsQuery } from "../slices/schoolApiSlice";
import bg from "/osco back.webp";

const Welcome = () => {
  const { data: schoolItems, isLoading: isLoadingSchool } =
    useGetSchoolItemsQuery();

  const school = schoolItems?.[0];

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: 3,
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          backdropFilter: "blur(5px)",
        },
      }}
    >
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {isLoadingSchool ? (
          <CircularProgress />
        ) : (
          <>
            <Avatar
              src={`${school.logo}`}
              sx={{
                width: "100px",
                height: "100px",
                marginBottom: 2,
              }}
            />
            <Typography
              variant="h4"
              gutterBottom
              sx={{
                textTransform: "uppercase",
                fontWeight: "bold",
                color: "#fff",
                padding: "10px",
                borderRadius: "5px",
              }}
            >
              {`Welcome to the ${school.name} Online Admission Portal`}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                margin: "0 auto",
                maxWidth: "90%",
                color: "#fff",
                padding: "15px",
                borderRadius: "5px",
              }}
            >
              This Portal allows you to manage online admissions efficiently.{" "}
              <br />
              Kindly review applications, update statuses, and handle enrollment
              tasks here.
              <br /> For technical support, contact our IT team. <br /> Your
              work is vital to our admission process and school
            </Typography>
            <Button
              color="primary"
              variant="contained"
              component={Link}
              to="/login"
              sx={{ my: 3 }}
            >
              Login
            </Button>
            <NetworkStatusWarning />
          </>
        )}
      </Box>
    </Box>
  );
};

export default Welcome;
