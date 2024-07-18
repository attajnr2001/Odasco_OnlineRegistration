import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import NetworkStatusWarning from "../helpers/NetworkStatusWarning";
import MuiAccordion from "@mui/material/Accordion";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import CircularProgress from "@mui/material/CircularProgress";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import { useGetSchoolItemsQuery } from "../slices/schoolApiSlice";
import { useNavigate, Link } from "react-router-dom";
import bg from "/osco back.webp";

const Home = () => {
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
          <Avatar
            src={`${school.logo}`}
            sx={{
              width: "100px",
              height: "100px",
              marginBottom: 2,
            }}
          />
        )}
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", mb: 2, color: "#fff" }}
        >
          WELCOME TO THE ONLINE SHS PLATFORM
        </Typography>

        <div>
          <Typography variant="p" sx={{ mb: 2, color: "#fff" }}>
            Welcome to Oda Senior High School's online admission platform! We've
            created this SHS Admission Portal to simplify your enrollment
            process. Instead of visiting the school, you can complete all
            admission steps here. Use this portal to check and submit your
            placement documents, print your admission letter and prospectus, and
            access other important information. Please only report to Oda Senior
            High School when classes officially begin.
          </Typography>
          <br />
          <Button component={Link} to="/login" variant="contained">
            Login
          </Button>
        </div>
      </Box>
      <NetworkStatusWarning />
    </Box>
  );
};

export default Home;
