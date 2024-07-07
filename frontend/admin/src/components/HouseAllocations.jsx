import React, { useMemo } from "react";
import { Box } from "@mui/material";
import Widget from "../components/Widget";
import "../styles/widget.css";
import Chart from "./Chart";
import NetworkStatusWarning from "../helpers/NetworkStatusWarning";
import { useGetStudentItemsQuery } from "../slices/studentApiSlice";
import { useGetHouseItemsQuery } from "../slices/houseApiSlice";

const HouseAllocations = () => {
  const {
    data: students,
    isLoading: studentsLoading,
    isError: studentsError,
  } = useGetStudentItemsQuery();
  const {
    data: houses,
    isLoading: housesLoading,
    isError: housesError,
  } = useGetHouseItemsQuery();

  const widgetData = useMemo(() => {
    if (!students) return [];

    const completedStudents = students.filter((student) => student.completed);
    const completedTotal = completedStudents.length;
    const completedDayStudents = completedStudents.filter(
      (student) => student.status === "Day"
    );
    const completedBoardingStudents = completedStudents.filter(
      (student) => student.status === "Boarding"
    );

    return [
      {
        type: "completedTotal",
        count: completedTotal,
        total: completedTotal,
      },
      {
        type: "day",
        count: completedDayStudents.length,
        total: completedTotal,
      },
      {
        type: "boarding",
        count: completedBoardingStudents.length,
        total: completedTotal,
      },
    ];
  }, [students]);

  const houseChartData = useMemo(() => {
    if (!houses) return [];
    return houses.map((house) => ({
      name: house.name,
      noOfStudents: house.noOfStudents,
    }));
  }, [houses]);

  if (studentsLoading || housesLoading) return <div>Loading...</div>;
  if (studentsError || housesError) return <div>Error loading data</div>;

  return (
    <Box>
      <Box
        sx={{
          display: { xs: "block", md: "flex" },
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          gap: 2,
          padding: 2,
        }}
      >
        {widgetData.map((data) => (
          <Box key={data.type} sx={{ flex: 1, display: "flex" }}>
            <Widget
              type={data.type}
              count={data.count}
              total={data.total}
              completedTotal={data.total}
            />
          </Box>
        ))}
      </Box>

      <Box sx={{ mt: 4, mb: 4 }}>
        <h2>House Allocations</h2>
        <Chart houseData={houseChartData} />
      </Box>

      <NetworkStatusWarning />
    </Box>
  );
};

export default HouseAllocations;
