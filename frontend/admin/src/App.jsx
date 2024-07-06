import { useContext } from "react";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./helpers/theme";
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import RootLayout from "./layouts/RootLayout";
import AdminConfig from "./components/AdminConfig";
import EditSchoolDetails from "./components/EditSchoolDetails";
import EditAdmissionDetails from "./components/EditAdmissionDetails";
import EditStudentDetails from "./components/EditStudentDetails";
import Houses from "./components/Houses";
import Programs from "./components/Programs";
import AdmissionDocument from "./components/AdmissionDocument";
import Logs from "./components/Logs";
import PlacementActions from "./components/PlacementActions";
import ViewStudent from "./components/ViewStudent";
import Users from "./components/Users";
import ManageStudent from "./components/ManageStudent";
import DeleteDatabase from "./components/DeleteDatabase";
import HouseAllocations from "./components/HouseAllocations";
import Error from "./pages/Error";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import store from "./store";
import { Provider } from "react-redux";

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route errorElement={<Error />}>
        <Route path="" element={<Welcome />} />
        <Route path="login" element={<Login />} />
        <Route path="admin" element={<RootLayout />}>
          <Route path="dashboard" element={<Dashboard />}>
            <Route path="admin-config" element={<AdminConfig />}>
              <Route path="edit-sch-details" element={<EditSchoolDetails />} />
              <Route
                path="edit-admission-details"
                element={<EditAdmissionDetails />}
              />
              <Route
                path="edit-student-dashboard"
                element={<EditStudentDetails />}
              />
            </Route>
            <Route path="user-setup" element={<Users />} />
            <Route path="houses" element={<Houses />} />
            <Route path="programs" element={<Programs />} />
            <Route path="admin-docs" element={<AdmissionDocument />} />
            <Route path="logs" element={<Logs />} />
            <Route path="placement-actions" element={<PlacementActions />} />
            <Route path="view-students" element={<ViewStudent />} />
            <Route path="manage-student" element={<ManageStudent />} />
            <Route path="delete-database" element={<DeleteDatabase />} />
            <Route path="house-allocations" element={<HouseAllocations />} />
          </Route>
        </Route>
        <Route path="*" element={<Error />} />
      </Route>
    )
  );

  return (
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </ThemeProvider>
  );
};

export default App;
