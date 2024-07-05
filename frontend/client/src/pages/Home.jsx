import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import NetworkStatusWarning from "../helpers/NetworkStatusWarning";
import MuiAccordion from "@mui/material/Accordion";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import { useNavigate, Link } from "react-router-dom";



const Home = () => {
  return (
    <>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="85vh"
        textAlign="center"
        flexDirection="column"
      >
        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
          WELCOME TO THE ONLINE SHS PLATFORM
        </Typography>

        <div>
          <Typography variant="p" sx={{ mb: 2, color: "#333" }}>
            "Welcome to our online admission platform for Senior High School!
            Our platform is designed to make the admission process seamless and
            efficient. <br /> <br />
            We developed this SHS Admission Portal. Instead of coming to the
            school for your SHS admissions process, use this Portal. You can use
            this portal to check and submit your placement documents, print your
            admission letter, prospectus and among other things. ONLY REPORT TO
            SCHOOL WHEN SCHOOL REOPENS...
          </Typography>{" "}
          <br />
          <Button component={Link} to="/login" variant="contained">
            Login
          </Button>
        </div>
      </Box>
      <NetworkStatusWarning />
    </>
  );
};

export default Home;
