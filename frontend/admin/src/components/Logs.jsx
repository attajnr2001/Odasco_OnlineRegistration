import React, { useState, useEffect } from "react";
import NetworkStatusWarning from "../helpers/NetworkStatusWarning"; // Import the component
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
import * as XLSX from "xlsx";
import Papa from "papaparse";
import { useGetLogItemsQuery } from "../slices/logApiSlice";
import { useLocationIP, getPlatform } from "../helpers/utils";


const Logs = () => {
  const { schoolID } = "schoolID";
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const { data: logItems, isLoading, isError, error } = useGetLogItemsQuery();

  if (isLoading) {
    return (
      <div className="loading-container">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <Alert severity="error">{error.message}</Alert>
      </div>
    );
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    const startIndex = newPage * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
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
        log.username,
        log.formattedDate,
        log.action,
        log.locationIP,
      ]),
    });
    doc.save("activity-log.pdf");
  };

  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const slicedLogs = logItems.slice(startIndex, endIndex);

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
              <TableRow key={log.id}>
                <TableCell>{log.user}</TableCell>
                <TableCell>{log.createdAt}</TableCell>
                <TableCell>{log.action}</TableCell>
                <TableCell>{log.locationIP}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10]}
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
