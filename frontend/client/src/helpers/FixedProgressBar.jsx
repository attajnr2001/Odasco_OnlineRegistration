import React from "react";
import { LinearProgress, Box } from "@mui/material";

const FixedProgressBar = ({ progress }) => {
  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        transition: "transform 0.3s ease-in-out",
      }}
    >
      <LinearProgress variant="buffer" value={progress} />
    </Box>
  );
};

export default FixedProgressBar;
