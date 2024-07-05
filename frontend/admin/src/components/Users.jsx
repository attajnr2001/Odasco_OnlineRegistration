import React, { useState, useEffect, useContext } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import NetworkStatusWarning from "../helpers/NetworkStatusWarning";
import AddUserModal from "../mod/AddUserModal";
import EditUserModal from "../mod/EditUserModal";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import Papa from "papaparse";
import {
  useGetUsersQuery,
  useToggleUserStatusMutation,
} from "../slices/usersApiSlice";
import { useSelector } from "react-redux";

const Users = () => {
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [openDeleteConfirmation, setOpenDeleteConfirmation] = useState(false);
  const [loading, setLoading] = useState(true);
  // const locationIP = useLocationIP();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [updating, setUpdating] = useState(false);

  const { data: users, isLoading, error, refetch } = useGetUsersQuery();
  const [toggleUserStatus] = useToggleUserStatusMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const handleToggleStatus = async (userId) => {
    if (userInfo.status === "user") {
      setOpenSnackbar(true);
      return;
    }

    try {
      await toggleUserStatus(userId).unwrap();
      refetch();
    } catch (err) {
      console.error("Failed to toggle user status:", err);
    }
  };
  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  if (isLoading) return <CircularProgress />;
  if (error) {
    return (
      <div className="error-container">
        <Alert severity="error">{error.message}</Alert>
      </div>
    );
  }

  const handleEditUser = (user) => {
    setSelectedUser({ ...user });
    setOpenEditModal(true);
  };

  const handleExportCSV = () => {
    const csvData = Papa.unparse(
      users.map((user) => ({
        Email: user.email,
        FullName: user.fullName,
        Phone: user.phone,
        Role: user.role,
        Status: user.active ? "Active" : "Inactive",
      }))
    );
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "users.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("Users Table", 20, 10);
    doc.autoTable({
      head: [["Email", "Full Name", "Phone", "Role", "Status"]],
      body: users.map((user) => [
        user.email,
        user.fullName,
        user.phone,
        user.role,
        user.active ? "Active" : "Inactive",
      ]),
    });
    doc.save("users.pdf");
  };

  const handleExportExcel = () => {
    const workBook = XLSX.utils.book_new();
    const workSheet = XLSX.utils.json_to_sheet(
      users.map((user) => ({
        Email: user.email,
        FullName: user.fullName,
        Phone: user.phone,
        Role: user.role,
        Status: user.active ? "Active" : "Inactive",
      }))
    );
    XLSX.utils.book_append_sheet(workBook, workSheet, "Users");
    XLSX.writeFile(workBook, "users.xlsx");
  };

  return (
    <div style={{ minHeight: "86vh" }}>
      <div className="house-buttons-container">
        <Button
          sx={{ mb: 2 }}
          variant="contained"
          color="primary"
          size="small"
          onClick={() => setOpenAddModal(true)}
        >
          Add New User
        </Button>
      </div>

      <div className="house-buttons" style={{ marginBottom: "2rem" }}>
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

      <div className="house-table">
        <TableContainer component={Paper} sx={{ whiteSpace: "nowrap", my: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">Email</TableCell>
                <TableCell align="center">Full Name</TableCell>
                <TableCell align="center">Phone</TableCell>
                <TableCell align="center">Role</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user, index) => (
                <TableRow key={index}>
                  <TableCell align="center">{user.email}</TableCell>
                  <TableCell align="center">{user.name}</TableCell>
                  <TableCell align="center">{user.phone}</TableCell>
                  <TableCell align="center">{user.role}</TableCell>
                  <TableCell>{user.status}</TableCell>

                  <TableCell>
                    <Button
                      variant="outlined"
                      color={user.status === "active" ? "secondary" : "primary"}
                      onClick={() => handleToggleStatus(user._id)}
                      disabled={user.role === "super"}
                    >
                      {user.status === "active" ? "Deactivate" : "Activate"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <AddUserModal
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        // onAddUser={handleAddUser}
        // selectedUser={selectedUser}
      />

      <NetworkStatusWarning />
    </div>
  );
};

export default Users;
