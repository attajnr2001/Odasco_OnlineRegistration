import React from "react";
import Login from "./pages/Login";
import Welcome from "./pages/Welcome";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./helpers/theme";
import MainLayout from "./layouts/MainLayout";
import RootLayout from "./layouts/RootLayout";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import EditStudent from "./pages/EditStudent";
import store from "./store";
import { Provider } from "react-redux";

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="" element={<RootLayout />}>
          <Route path="" element={<Welcome />}>
            <Route index element={<Home />} />
          </Route>

          <Route path="login" element={<Login />} />
          <Route path="dashboard" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="edit-student" element={<EditStudent />} />
          </Route>
        </Route>
      </>
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
