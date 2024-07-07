import React, { lazy, Suspense, useState, useMemo } from "react";
import { Outlet } from "react-router-dom";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { motion, AnimatePresence } from "framer-motion";
import { useGetStudentItemsQuery } from "../slices/studentApiSlice"; 

const Widget = lazy(() => import("../components/Widget"));

const Dashboard = () => {
  const [showWidgets, setShowWidgets] = useState(true);
  const { data: students, isLoading, isError } = useGetStudentItemsQuery();

  const toggleWidgets = () => {
    setShowWidgets(!showWidgets);
  };

  const widgetData = useMemo(() => {
    if (!students) return [];

    const totalStudents = students.length;
    const completedStudents = students.filter(
      (student) => student.completed
    ).length;
    const incompleteStudents = totalStudents - completedStudents;

    return [
      { type: "total", count: totalStudents, total: totalStudents },
      { type: "completed", count: completedStudents, total: totalStudents },
      { type: "incomplete", count: incompleteStudents, total: totalStudents },
    ];
  }, [students]);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 2,
        }}
      >
        <IconButton onClick={toggleWidgets} sx={{ p: 0 }}>
          {showWidgets ? <VisibilityOffIcon /> : <VisibilityIcon />}
        </IconButton>
      </Box>
      <AnimatePresence>
        {showWidgets && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
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
                  <Suspense fallback={<div>Loading...</div>}>
                    <Widget type={data.type} count={data.count} total={data.total} />
                  </Suspense>
                </Box>
              ))}
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
      <Outlet />
    </>
  );
};

export default React.memo(Dashboard);