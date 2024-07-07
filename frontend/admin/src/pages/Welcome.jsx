import { Box, Typography, Button, Avatar } from "@mui/material";
import { Link } from "react-router-dom";
import React from "react";
import NetworkStatusWarning from "../helpers/NetworkStatusWarning";
import { useGetSchoolItemsQuery } from "../slices/schoolApiSlice";

const Welcome = () => {
  const { data: schoolItems, isLoading: isLoadingSchool } =
    useGetSchoolItemsQuery();

  const school = schoolItems?.[0];

  return (
    <Box
      sx={{
        height: "85vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: 3,
      }}
    >
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
        sx={{ textTransform: "uppercase", fontWeight: "bold", color: "#333" }}
      >
        {`Welcome to the ${school.name} Online Admission Portal`}
      </Typography>
      <Typography variant="body1" sx={{ margin: "0 auto", maxWidth: "90%" }}>
        We are delighted to have you on board for the Senior High School online
        admission process. Our platform is designed to provide you with a
        seamless and efficient experience as you navigate through the
        application and admission stages. Whether you are here to apply for a
        new admission, check the status of your application, or manage other
        administrative tasks, our system is equipped to assist you at every
        step. Should you need any support, do not hesitate to reach out to our
        help desk. Thank you for choosing our platform, and we look forward to
        supporting your educational journey.
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
    </Box>
  );
};

export default Welcome;
