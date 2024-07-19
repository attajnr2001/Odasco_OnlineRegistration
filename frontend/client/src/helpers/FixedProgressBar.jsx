import React, { useState, useEffect } from "react";
import { LinearProgress, Box, Typography, Slide } from "@mui/material";

const FixedProgressBar = ({ completionPercentage }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <Slide direction="down" in={isVisible} mountOnEnter unmountOnExit>
      <Box
        sx={{
          position: "fixed",
          top: "5rem",
          left: 0,
          right: 0,
          zIndex: 9999,
          backgroundColor: "transparent",
          padding: "5px 10px",
        }}
      >
        <LinearProgress
          variant="determinate"
          value={completionPercentage}
          sx={{
            height: 6,
            borderRadius: 3,
            backgroundColor: "#ffcccb",
            "& .MuiLinearProgress-bar": {
              borderRadius: 3,
              backgroundColor:
                completionPercentage === 100 ? "#2bd918" : "crimson",
            },
          }}
        />
        <Typography 
          variant="caption" 
          color="textSecondary" 
          align="center" 
          sx={{ 
            display: 'block', 
            marginTop: '2px',
            fontSize: '0.9rem'
          }}
        >
          Completion: {completionPercentage}%
        </Typography>
      </Box>
    </Slide>
  );
};

export default FixedProgressBar;