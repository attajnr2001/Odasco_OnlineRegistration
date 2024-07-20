import React, { useState, useEffect } from "react";
import NetworkStatusWarning from "../helpers/NetworkStatusWarning"; // Import the component
import {
  Button,
  TextField,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  CircularProgress,
  TableSortLabel,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Alert,
  Tooltip,
} from "@mui/material";
import AddStudentModal from "../mod/AddStudentModal";
import ImportStudentExcel from "../mod/ImportStudentExcel";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { visuallyHidden } from "@mui/utils";
import { useLocationIP, useCreateLog } from "../helpers/utils";
import {
  useGetStudentItemsQuery,
  useUpdateStudentItemMutation,
  useDeleteUnregisteredStudentsMutation,
  useDeleteStudentItemMutation,
  useGetRecentStudentsQuery,
} from "../slices/studentApiSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  useGetProgramItemsQuery,
  useUpdateProgramItemMutation,
} from "../slices/programApiSlice";

const PlacementActions = () => {
  const [page, setPage] = useState(0);

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openAddStudentModal, setOpenAddStudentModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("");
  const [openImportDialog, setOpenImportDialog] = useState(false);
  const [order, setOrder] = useState("desc");
  const [orderByIndex, setOrderBy] = useState("createdAt");
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const { locationIP, loading: ipLoading } = useLocationIP();
  const { userInfo } = useSelector((state) => state.auth);
  const createLog = useCreateLog();

  const {
    data: studentItems,
    isLoading,
    isError,
    error,
    a,
  } = useGetStudentItemsQuery();
  const { data: recentStudents, isLoading: isLoadingRecent } =
    useGetRecentStudentsQuery();
  const [deleteUnregisteredStudents, { isLoading: isDeleting }] =
    useDeleteUnregisteredStudentsMutation();
  const [updateProgramItem] = useUpdateProgramItemMutation();

  const { data: programs, isLoading: programsLoading } =
    useGetProgramItemsQuery();
  const getProgramName = (programId) => {
    if (!programs) return "Loading...";
    const program = programs.find((p) => p._id === programId);
    return program ? program.name : "Unknown Program";
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

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

  const handleImportButtonClick = () => {
    setOpenImportDialog(true);
  };

  const handlePDFExport = async () => {
    try {
      if (!recentStudents || recentStudents.length === 0) {
        setSnackbarMessage("No recent students to export");
        setSnackbarOpen(true);
        return;
      }

      const doc = new jsPDF();
      doc.text("Recently Imported Students List", 20, 10);
      doc.autoTable({
        head: [
          [
            "Index Number",
            "Student Name",
            "JHS Attended",
            "Aggregate",
            "Program",
            "Year",
            "Status",
          ],
        ],
        body: recentStudents.map((student) => [
          student.indexNumber,
          `${student.otherNames} ${student.surname}`,
          student.jhsAttended,
          student.aggregate,
          getProgramName(student.program),
          student.year,
          student.status,
        ]),
      });

      doc.save("recent_students.pdf");
    } catch (error) {
      console.log("Error downloading list", error);
      setSnackbarMessage("Error downloading list");
      setSnackbarOpen(true);
    }
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderByIndex === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const filteredStudents = studentItems.filter((student) => {
    const fullName = `${student.otherNames} ${student.surname}`.toLowerCase();
    const programName = getProgramName(student.program).toLowerCase();
    return fullName.includes(searchQuery) || programName.includes(searchQuery);
  });

  const getComparator = (order, orderByIndex) => {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderByIndex)
      : (a, b) => -descendingComparator(a, b, orderByIndex);
  };

  const descendingComparator = (a, b, orderByIndex) => {
    if (b[orderByIndex] < a[orderByIndex]) {
      return -1;
    }
    if (b[orderByIndex] > a[orderByIndex]) {
      return 1;
    }
    return 0;
  };

  const stableSort = (array, comparator) => {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  };

  const sortedStudents = stableSort(
    filteredStudents,
    getComparator(order, orderByIndex)
  );

  const handleDeleteUnregisteredStudents = async () => {
    setOpenDialog(true);
  };

  const handleDialogClose = async (confirm) => {
    setOpenDialog(false);
    if (confirm) {
      try {
        const result = await deleteUnregisteredStudents().unwrap();
        console.log("Unregistered students deleted successfully!");
        setSnackbarMessage(result.message);
        setSnackbarOpen(true);
        setAlertSeverity("success");

        // Update program noOfStudents
        for (const { _id: programId, count } of result.deletedCounts) {
          const program = programs.find((p) => p._id === programId);
          if (program) {
            await updateProgramItem({
              id: programId,
              noOfStudents: program.noOfStudents - count,
            });
          }
        }

        if (!ipLoading) {
          await createLog(`Unregistered Students Deleted`, userInfo._id, locationIP);
        } else {
          console.log("IP address not available yet");
        }
      } catch (error) {
        console.error("Error deleting unregistered students:", error);
        setSnackbarMessage(
          "Error deleting unregistered students: " +
            (error.data?.message || error.error)
        );
        setSnackbarOpen(true);
        setAlertSeverity("error");
      }
    }
  };

  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;

  const currentPageData = sortedStudents.slice(startIndex, endIndex);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // reset page to 0 when rows per page changes
  };

  return (
    <div>
      <Grid container spacing={2} alignItems="center">
        {userInfo.role === "super" && (
          <Grid item>
            <Tooltip title="Add a new student record manually(Protocol)" arrow>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => setOpenAddStudentModal(true)}
              >
                Add New Single Record
              </Button>
            </Tooltip>
          </Grid>
        )}

        <Grid item>
          <Tooltip title="Import Students automatically placed" arrow>
            <Button
              variant="outlined"
              color="success"
              onClick={handleImportButtonClick}
            >
              Import from CSSPS Excel
            </Button>
          </Tooltip>
        </Grid>

        <Grid item>
          <Tooltip
            title="Download a PDF of recently imported student records"
            arrow
          >
            <span>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handlePDFExport}
                disabled={isLoadingRecent}
              >
                {isLoadingRecent
                  ? "Loading..."
                  : "Download Recently Imported List"}
              </Button>
            </span>
          </Tooltip>
        </Grid>

        <Grid item>
          <Tooltip title="Remove all unregistered student placements" arrow>
            <span>
              <Button
                variant="outlined"
                color="error"
                onClick={handleDeleteUnregisteredStudents}
                disabled={isDeleting}
              >
                {isDeleting
                  ? "Deleting..."
                  : "Delete All Unregistered Placement"}
              </Button>
            </span>
          </Tooltip>
        </Grid>
      </Grid>
      <Grid
        container
        alignItems="center"
        style={{ marginTop: "1rem" }}
        spacing={1}
      >
        <Grid item xs={12}>
          <TextField
            label="Search student by name"
            variant="outlined"
            fullWidth
            size="small"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </Grid>
      </Grid>
      <TableContainer
        component={Paper}
        id="table"
        sx={{ marginTop: "1em", whiteSpace: "nowrap" }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Index Number
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                <TableSortLabel
                  active={orderByIndex === "surname"}
                  direction={orderByIndex === "surname" ? order : "asc"}
                  onClick={(event) => handleRequestSort(event, "surname")}
                >
                  Student Name
                  {orderByIndex === "surname" ? (
                    <Box component="span" sx={visuallyHidden}>
                      {order === "desc"
                        ? "sorted descending"
                        : "sorted ascending"}
                    </Box>
                  ) : null}
                </TableSortLabel>
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                JHS Attended
              </TableCell>

              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Aggregate
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Program
              </TableCell>

              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Status
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                <TableSortLabel
                  active={orderByIndex === "completed"}
                  direction={orderByIndex === "completed" ? order : "asc"}
                  onClick={(event) => handleRequestSort(event, "completed")}
                >
                  Registered
                  {orderByIndex === "completed" ? (
                    <Box component="span" sx={visuallyHidden}>
                      {order === "desc"
                        ? "sorted descending"
                        : "sorted ascending"}
                    </Box>
                  ) : null}
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentPageData.map((student, index) => (
              <TableRow key={index}>
                <TableCell align="center">{student.indexNumber}</TableCell>
                <TableCell align="center">{`${student.otherNames} ${student.surname}`}</TableCell>
                <TableCell align="center">{student.jhsAttended}</TableCell>
                <TableCell align="center">{student.aggregate}</TableCell>
                <TableCell align="center">
                  {getProgramName(student.program)}
                </TableCell>
                <TableCell align="center">{student.status}</TableCell>
                <TableCell align="center">
                  {student.completed ? "Yes" : "No"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 20, 50]}
        component="div"
        count={sortedStudents.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <AddStudentModal
        open={openAddStudentModal}
        onClose={() => setOpenAddStudentModal(false)}
      />
      <ImportStudentExcel
        open={openImportDialog}
        onClose={() => setOpenImportDialog(false)}
        programs={programs}
      />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity={alertSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Dialog
        open={openDialog}
        onClose={(event, reason) => {
          if (reason !== "backdropClick") {
            handleDialogClose(false);
          }
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete all unregistered students?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => handleDialogClose(false)}
            color="error"
            autoFocus
          >
            Cancel
          </Button>
          <Button onClick={() => handleDialogClose(true)} variant="contained">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      <NetworkStatusWarning />
    </div>
  );
};

// Utility functions for sorting
function descendingComparator(a, b, orderByIndex) {
  if (b[orderByIndex] < a[orderByIndex]) {
    return -1;
  }
  if (b[orderByIndex] > a[orderByIndex]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderByIndex) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderByIndex)
    : (a, b) => -descendingComparator(a, b, orderByIndex);
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

export default PlacementActions;
