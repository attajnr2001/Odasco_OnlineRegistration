import React, { useState, useEffect } from "react";
import NetworkStatusWarning from "../helpers/NetworkStatusWarning"; // Import the component
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  TableSortLabel,
  TablePagination,
  Box,
  Snackbar,
} from "@mui/material";
import AddProgramModal from "../mod/AddProgramModal";
import EditProgramModal from "../mod/EditProgramModal";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import Papa from "papaparse";
import { visuallyHidden } from "@mui/utils";
import { useLocationIP, getPlatform, useCreateLog } from "../helpers/utils";
import {
  useGetProgramItemsQuery,
  useAddProgramItemMutation,
  useUpdateProgramItemMutation,
  useDeleteProgramItemMutation,
} from "../slices/programApiSlice";

const Programs = () => {
  const { schoolID } = "schoolID";
  const [programs, setPrograms] = useState([]);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("programID");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [openDeleteConfirmation, setOpenDeleteConfirmation] = useState(false);
  const createLog = useCreateLog();
  const { locationIP, loading: ipLoading } = useLocationIP();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const {
    data: programItems,
    isLoading,
    isError,
    error,
  } = useGetProgramItemsQuery();

  useEffect(() => {
    if (programItems) {
      setPrograms(programItems);
    }
  }, [programItems]);

  const handleAddProgram = (newProgram) => {
    setPrograms([...programs, newProgram]);
  };
  const [deleteProgramItem] = useDeleteProgramItemMutation();

  if (isLoading) {
    return (
      <div className="loading-container">
        <CircularProgress />
      </div>
    );
  }

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEditProgram = (row) => {
    setSelectedRow(row);
    setOpenEditModal(true);
  };

  const handleDeleteProgram = async () => {
    if (!selectedRow) return;

    try {
      await deleteProgramItem(selectedRow._id).unwrap();
      setSnackbarMessage("Program deleted successfully");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setPrograms(
        programs.filter((program) => program._id !== selectedRow._id)
      );

      // Log the deletion
      if (!ipLoading) {
        await createLog("Program deleted", selectedRow._id, locationIP);
      } else {
        console.log("IP address not available yet");
      }
    } catch (error) {
      console.error("Error deleting program:", error);
      setSnackbarMessage(
        "Error deleting program: " + (error.data?.message || error.error)
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }

    setOpenDeleteConfirmation(false);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleExportCSV = () => {
    console.log("csv printing");
    const csvData = Papa.unparse(
      programs.map((program) => ({
        ProgramID: program.programID,
        ProgramName: program.name,
        ShortName: program.shortName,
        NumberOfStudents: program.noOfStudents,
      }))
    );
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "programs.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    console.log("csv printing");
  };

  const handleExportPDF = () => {
  console.log("pdf printing");
    const doc = new jsPDF();
    doc.text("Programs Table", 20, 10);
    doc.autoTable({
      head: [
        ["Program ID", "Program Name", "Short Name", "Number of Students"],
      ],
      body: programs.map((program) => [
        program.programID,
        program.name,
        program.shortName,
        program.noOfStudents,
      ]),
    });
    doc.save("programs.pdf");
  };

  const handleExportExcel = () => {
    console.log("excel printing");
    const workBook = XLSX.utils.book_new();
    const workSheet = XLSX.utils.json_to_sheet(
      programs.map((program) => ({
        ProgramID: program.programID,
        ProgramName: program.name,
        ShortName: program.shortName,
        NumberOfStudents: program.noOfStudents,
      }))
    );
    XLSX.utils.book_append_sheet(workBook, workSheet, "Programs");
    XLSX.writeFile(workBook, "programs.xlsx");
  };

  if (error) {
    return (
      <div className="error-container">
        <Alert severity="error">{error.message}</Alert>
      </div>
    );
  }

  const sortedPrograms = stableSort(programs, getComparator(order, orderBy));

  return (
    <div>
      <div className="house-buttons-container">
        <Button
          sx={{ mb: 2 }}
          variant="contained"
          color="primary"
          size="small"
          onClick={() => setOpenAddModal(true)}
        >
          Add New Program
        </Button>
      </div>
      <div className="house-buttons">
        <Button
          variant="outlined"
          color="primary"
          size="small"
          onClick={handleExportCSV}
        >
          CSV
        </Button>
        <Button
          variant="outlined"
          color="primary"
          size="small"
          onClick={handleExportExcel}
        >
          Excel
        </Button>
        <Button
          variant="outlined"
          color="primary"
          size="small"
          onClick={handleExportPDF}
        >
          PDF
        </Button>
      </div>
      <div className="house-table" id="program-table">
        <TableContainer
          component={Paper}
          sx={{ marginTop: "1em", whiteSpace: "nowrap" }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell
                  align="center"
                  sortDirection={orderBy === "programID" ? order : false}
                >
                  <TableSortLabel
                    active={orderBy === "programID"}
                    direction={orderBy === "programID" ? order : "asc"}
                    onClick={(event) => handleRequestSort(event, "programID")}
                  >
                    Program ID
                    {orderBy === "programID" ? (
                      <Box component="span" sx={visuallyHidden}>
                        {order === "desc"
                          ? "sorted descending"
                          : "sorted ascending"}
                      </Box>
                    ) : null}
                  </TableSortLabel>
                </TableCell>
                <TableCell
                  align="center"
                  sortDirection={orderBy === "name" ? order : false}
                >
                  <TableSortLabel
                    active={orderBy === "name"}
                    direction={orderBy === "name" ? order : "asc"}
                    onClick={(event) => handleRequestSort(event, "name")}
                  >
                    Program Name
                    {orderBy === "name" ? (
                      <Box component="span" sx={visuallyHidden}>
                        {order === "desc"
                          ? "sorted descending"
                          : "sorted ascending"}
                      </Box>
                    ) : null}
                  </TableSortLabel>
                </TableCell>

                <TableCell
                  align="center"
                  sortDirection={orderBy === "shortName" ? order : false}
                >
                  <TableSortLabel
                    active={orderBy === "shortName"}
                    direction={orderBy === "shortName" ? order : "asc"}
                    onClick={(event) => handleRequestSort(event, "shortName")}
                  >
                    Short Name
                    {orderBy === "shortName" ? (
                      <Box component="span" sx={visuallyHidden}>
                        {order === "desc"
                          ? "sorted descending"
                          : "sorted ascending"}
                      </Box>
                    ) : null}
                  </TableSortLabel>
                </TableCell>
                <TableCell
                  align="center"
                  sortDirection={orderBy === "programID" ? order : false}
                >
                  <TableSortLabel
                    active={orderBy === "programID"}
                    direction={orderBy === "programID" ? order : "asc"}
                    onClick={(event) => handleRequestSort(event, "programID")}
                  >
                    Number of Students
                    {orderBy === "programID" ? (
                      <Box component="span" sx={visuallyHidden}>
                        {order === "desc"
                          ? "sorted descending"
                          : "sorted ascending"}
                      </Box>
                    ) : null}
                  </TableSortLabel>
                </TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedPrograms
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <TableRow key={row.id}>
                    <TableCell align="center">{row.programID}</TableCell>
                    <TableCell align="center">{row.name}</TableCell>
                    <TableCell align="center">{row.shortName}</TableCell>
                    <TableCell align="center">{row.noOfStudents}</TableCell>
                    <TableCell align="center">
                      <Button
                        onClick={() => handleEditProgram(row)}
                        variant="outlined"
                        size="small"
                        color="primary"
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => {
                          setSelectedRow(row);
                          setOpenDeleteConfirmation(true);
                        }}
                        variant="outlined"
                        size="small"
                        color="error"
                        sx={{ ml: 1 }}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={programs.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      </div>
      <AddProgramModal
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        onAddProgram={handleAddProgram}
      />
      <EditProgramModal
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        rowData={selectedRow}
      />
      <Dialog
        open={openDeleteConfirmation}
        onClose={() => setOpenDeleteConfirmation(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          {selectedRow?.noOfStudents > 0 ? (
            <Alert severity="warning">
              This house has students assigned to it. Deleting it will also
              remove all associated students houses
            </Alert>
          ) : (
            "Are you sure you want to delete this house?"
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteConfirmation(false)}>
            Cancel
          </Button>
          <Button onClick={handleDeleteProgram} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <NetworkStatusWarning />
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

export default Programs;
