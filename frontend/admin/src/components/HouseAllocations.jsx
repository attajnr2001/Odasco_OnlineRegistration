import React, { useEffect, useState } from "react";
import { Button, Box } from "@mui/material";
import Widget from "../components/Widget";
import "../styles/widget.css";
import Chart from "./Chart";
import { useParams } from "react-router-dom";
import NetworkStatusWarning from "../helpers/NetworkStatusWarning";

const HouseAllocations = () => {
  const [houseData, setHouseData] = useState([]);
  const [totalStudents, setTotalStudents] = useState(0);
  const [boardingStudents, setBoardingStudents] = useState(0);
  const [dayStudents, setDayStudents] = useState(0);
  const { schoolID } = "schoolID";
  const [showWidgets, setShowWidgets] = useState(false);
  ("DAY");
  const toggleWidgets = () => {
    setShowWidgets(!showWidgets);
  };

  useEffect(() => {
    const fetchHouseData = () => {};
    const fetchStudentData = () => {};
  }, [schoolID]);

  const handlePrintHouseAllocations = () => {
    console.log("Printing house allocations...");
  };

  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        size="small"
        onClick={handlePrintHouseAllocations}
      >
        Print House Allocations
      </Button>

      <Box
        sx={{
          display: { xs: "block", md: "flex" },
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          gap: 2,
          padding: 2,
        }}
      >
        <Widget type="total" pop={totalStudents} />
        <Widget type="BOARDING" pop={boardingStudents} />
        <Widget type="DAY" pop={dayStudents} />
      </Box>
      <div className="chart">
        <Chart
          aspect={2 / 1}
          title={"Summary of House Allocation"}
          data={houseData}
        />
      </div>
      <NetworkStatusWarning />
    </div>
  );
};

export default HouseAllocations;
