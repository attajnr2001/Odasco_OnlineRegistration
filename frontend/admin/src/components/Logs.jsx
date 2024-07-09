import React, { useState, useEffect } from "react";
import NetworkStatusWarning from "../helpers/NetworkStatusWarning";
import { useParams } from "react-router-dom";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  CircularProgress,
  Alert,
} from "@mui/material";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { format, parseISO } from "date-fns";
import { useGetLogItemsQuery } from "../slices/logApiSlice";
import { useLocationIP, getPlatform } from "../helpers/utils";

const Logs = () => {
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { data: logItems, isLoading, isError, error } = useGetLogItemsQuery();

  useEffect(() => {
    if (logItems) {
      setLogs(logItems);
    }
  }, [logItems]);

  if (isLoading) {
    return (
      <div className="loading-container">
        <CircularProgress />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="error-container">
        <Alert severity="error">{error.message}</Alert>
      </div>
    );
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handlePrintActivityLog = () => {
    const doc = new jsPDF();
    doc.text("Activity Log", 20, 10);
    doc.autoTable({
      head: [["Username", "Date Time", "Action", "Location IP"]],
      body: logs.map((log) => [
        log.user ? log.user.name : "Unknown",
        format(parseISO(log.createdAt), "yyyy-MM-dd HH:mm:ss"),
        log.action,
        log.locationIP,
      ]),
    });
    doc.save("activity-log.pdf");
  };

  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const slicedLogs = logs.slice(startIndex, endIndex);

  return (
    <div>
      <Button
        variant="contained"
        onClick={handlePrintActivityLog}
        sx={{ marginBottom: "1em" }}
        size="small"
      >
        Print Activity Log
      </Button>
      <TableContainer component={Paper} sx={{ whiteSpace: "nowrap" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Username</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Action</TableCell>
              <TableCell>Location IP</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {slicedLogs.map((log) => (
              <TableRow key={log._id}>
                <TableCell>{log.user ? log.user.name : "Unknown"}</TableCell>
                <TableCell>
                  {format(parseISO(log.createdAt), "yyyy-MM-dd HH:mm:ss")}
                </TableCell>
                <TableCell>{log.action}</TableCell>
                <TableCell>{log.locationIP}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={logs.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <NetworkStatusWarning />
    </div>
  );
};

export default Logs;
