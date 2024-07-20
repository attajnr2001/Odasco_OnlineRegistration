import React, { useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Slide from "@mui/material/Slide";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import Avatar from "@mui/material/Avatar";
import CircularProgress from "@mui/material/CircularProgress";
import { Box } from "@mui/system";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Menu from "@mui/material/Menu";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Button from "@mui/material/Button";
import { logout } from "../slices/authSlice";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../slices/usersApiSlice";
import logo from "/logo.jpg";
import { useGetSchoolItemsQuery } from "../slices/schoolApiSlice";
import { useLocationIP, useCreateLog } from "../helpers/utils";
import { NavLink, Link, useNavigate } from "react-router-dom";
import NetworkStatusWarning from "../helpers/NetworkStatusWarning";
import "../styles/navbar.css";
import EditProfile from "../mod/EditProfile";

const HideOnScroll = (props) => {
  const { children } = props;
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
};

const Navbar = () => {
  const navigate = useNavigate();
  const createLog = useCreateLog();
  const { locationIP, loading: ipLoading } = useLocationIP();
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const [utilitiesOpen, setUtilitiesOpen] = useState(false);
  const [placementOpen, setPlacementOpen] = useState(false);
  const [actionsOpen, setActionsOpen] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [openChangePassword, setOpenChangePassword] = useState(false);
  const [schoolShortName, setSchoolShortName] = useState("");
  const [schoolImage, setSchoolImage] = useState(logo);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [admissionYear, setAdmissionYear] = useState(null);
  const { userInfo } = useSelector((state) => state.auth);
  const [openProfile, setOpenProfile] = useState(false);
  const dispatch = useDispatch();
  const [logoutApiCall] = useLogoutMutation();
  const {
    data: schoolItems,
    isLoading,
    isError,
    error,
  } = useGetSchoolItemsQuery();

  const resetMenuState = () => {
    setDashboardOpen(false);
    setUtilitiesOpen(false);
    setPlacementOpen(false);
    setActionsOpen(false);
    setMenuAnchor(null);
  };

  useEffect(() => {
    resetMenuState();
    if (schoolItems && schoolItems.length > 0) {
      const school = schoolItems[0];
      setSchoolShortName(school.shortName || "");
      setAdmissionYear(school.academicYear || "");
    }
  }, [schoolItems]);

  if (isLoading) return <CircularProgress />;
  if (isError) return <div>Error</div>;

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logoutApiCall().unwrap();

      if (!ipLoading && userInfo) {
        await createLog("User Logout", userInfo._id, locationIP);
      } else {
        console.log("IP address not available yet or user info is missing");
      }

      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleDashboardClick = () => {
    setDashboardOpen(!dashboardOpen);
  };

  const handleUtilitiesClick = () => {
    setUtilitiesOpen(!utilitiesOpen);
  };

  const handlePlacementClick = () => {
    setPlacementOpen(!placementOpen);
  };

  const handleActionsClick = () => {
    setActionsOpen(!actionsOpen);
  };

  const handleMenuOpen = (event) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  return (
    <>
      <HideOnScroll>
        <AppBar
          position="fixed"
          sx={{
            backgroundColor: "white",
            color: "black",
            whiteSpace: "nowrap",
          }}
        >
          <Toolbar>
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                flexGrow: 1,
                textTransform: "uppercase",
              }}
            >
              ONLINE REGISTRATION
            </Typography>
            <Avatar
              alt="User Avatar"
              src={schoolImage}
              sx={{ width: 30, height: 30 }}
            />
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                flexGrow: 1,
                textTransform: "uppercase",
              }}
            >
              {schoolShortName ? schoolShortName : ""}
              {admissionYear && ` ${admissionYear}`}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
              {userInfo ? (
                <>
                  <IconButton
                    color="inherit"
                    aria-label="menu"
                    onClick={handleMenuOpen}
                    edge="start"
                  >
                    <MenuIcon />
                  </IconButton>
                  <Menu
                    id="menu-appbar"
                    anchorEl={menuAnchor}
                    open={Boolean(menuAnchor)}
                    onClose={handleMenuClose}
                  >
                    <List sx={{ whiteSpace: "nowrap" }}>
                      <ListItemButton onClick={handleDashboardClick} divider>
                        <ListItemText secondary="DASHBOARD" />
                        {dashboardOpen}
                      </ListItemButton>

                      <ListItemButton onClick={handleUtilitiesClick}>
                        <ListItemText secondary="UTILITIES" />
                        {utilitiesOpen ? <ExpandLess /> : <ExpandMore />}
                      </ListItemButton>
                      <Collapse in={utilitiesOpen} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                          <ListItemButton sx={{ pl: 4 }} dense>
                            <ListItemText
                              primary="Change Profile"
                              sx={{ fontWeight: "bold" }}
                              onClick={() => setOpenProfile(true)}
                            />

                            <EditProfile
                              open={openProfile}
                              onClose={() => setOpenProfile(false)}
                              user={userInfo}
                            />
                          </ListItemButton>
                          <ListItemButton sx={{ pl: 4 }} dense>
                            <NavLink to={`dashboard/user-setup`}>
                              <ListItemText primary="User Setup" />
                            </NavLink>
                          </ListItemButton>
                          <ListItemButton sx={{ pl: 4 }} dense>
                            <NavLink
                              to={`dashboard/admin-config/edit-sch-details`}
                            >
                              <ListItemText primary="Admission Config" />
                            </NavLink>
                          </ListItemButton>
                          <ListItemButton sx={{ pl: 4 }} dense>
                            <NavLink to={`dashboard/houses`}>
                              <ListItemText primary="Houses" />
                            </NavLink>
                          </ListItemButton>
                          <ListItemButton sx={{ pl: 4 }} dense>
                            <NavLink to={`dashboard/programs`}>
                              <ListItemText primary="Programmes" />
                            </NavLink>
                          </ListItemButton>
                          <ListItemButton sx={{ pl: 4 }} dense>
                            <NavLink to={`dashboard/admin-docs`}>
                              <ListItemText primary="Admission Docs" />
                            </NavLink>
                          </ListItemButton>
                          <ListItemButton sx={{ pl: 4 }} dense>
                            <NavLink to={`dashboard/logs`}>
                              <ListItemText primary="Logs" />
                            </NavLink>
                          </ListItemButton>
                        </List>
                      </Collapse>
                      <ListItemButton onClick={handlePlacementClick}>
                        <ListItemText secondary="PLACEMENT" />
                        {placementOpen ? <ExpandLess /> : <ExpandMore />}
                      </ListItemButton>
                      <Collapse in={placementOpen} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                          <ListItemButton sx={{ pl: 4 }} dense>
                            <NavLink to={`dashboard/placement-actions`}>
                              <ListItemText primary="Manage CSSPS List" />
                            </NavLink>
                          </ListItemButton>
                          {/* <ListItemButton sx={{ pl: 4 }} dense>
                            <NavLink to={`dashboard/view-students`}>
                              <ListItemText primary="View Students" />
                            </NavLink>
                          </ListItemButton> */}
                          <ListItemButton sx={{ pl: 4 }} dense>
                            <NavLink to={`dashboard/manage-student`}>
                              <ListItemText primary="Manage Students" />
                            </NavLink>
                          </ListItemButton>
                          {/* <ListItemButton sx={{ pl: 4 }} dense>
                            <NavLink to={`dashboard/house-allocations`}>
                              <ListItemText primary="House Allocations" />
                            </NavLink>
                          </ListItemButton> */}
                        </List>
                      </Collapse>
                      <ListItemButton onClick={handleActionsClick}>
                        <ListItemText secondary="ACTIONS" />
                        {actionsOpen ? <ExpandLess /> : <ExpandMore />}
                      </ListItemButton>
                      <Collapse in={actionsOpen} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                          <ListItemButton sx={{ pl: 4 }} dense>
                            <NavLink to={`dashboard/delete-database`}>
                              <ListItemText primary="Delete Database" />
                            </NavLink>
                          </ListItemButton>
                          <ListItemButton sx={{ pl: 4 }} dense>
                            <ListItemText
                              primary={
                                isLoggingOut ? (
                                  <CircularProgress size={20} />
                                ) : (
                                  "Logout"
                                )
                              }
                              sx={{ fontWeight: "bold" }}
                              onClick={isLoggingOut ? undefined : handleLogout}
                            />
                          </ListItemButton>
                        </List>
                      </Collapse>
                    </List>
                  </Menu>
                </>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  component={Link}
                  to="/login"
                >
                  Login
                </Button>
              )}
            </Box>
          </Toolbar>
        </AppBar>
      </HideOnScroll>
      <NetworkStatusWarning />
    </>
  );
};

export default Navbar;
