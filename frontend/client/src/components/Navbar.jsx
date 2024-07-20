import React, { useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Slide from "@mui/material/Slide";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import NetworkStatusWarning from "../helpers/NetworkStatusWarning";
import Button from "@mui/material/Button";
import { Box } from "@mui/system";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Drawer from "@mui/material/Drawer";
import { useGetSchoolItemsQuery } from "../slices/schoolApiSlice";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { useParams, NavLink, useNavigate } from "react-router-dom";
import { logout } from "../slices/authSlice";
import CircularProgress from "@mui/material/CircularProgress";
import "../styles/navbar.css";
import viteLogo from "/logo.jpg";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../slices/clientApiSlice";

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
  const [menuOpen, setMenuOpen] = useState(false);
  const [admissionYear, setAdmissionYear] = useState(null);
  const [schoolShortName, setSchoolShortName] = useState("");
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();
  const {
    data: schoolItems,
    isLoading,
    isError,
    error,
  } = useGetSchoolItemsQuery();
  const { clientInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [logoutApiCall] = useLogoutMutation();

  useEffect(() => {
    if (schoolItems && schoolItems.length > 0) {
      const school = schoolItems[0];
      setSchoolShortName(school.shortName || "");
      setAdmissionYear(school.academicYear || "");
    }
  }, [schoolItems]);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Please Login Again...</div>;

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const activeStyle = {
    backgroundColor: "#2bd918",
    color: "#fff",
    fontWeight: "bold",
  };

  const NavButton = ({ to, children }) => (
    <Button
      component={NavLink}
      to={to}
      sx={{
        color: "black",
        "&.active": activeStyle,
      }}
    >
      {children}
    </Button>
  );

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
                display: { xs: "none", sm: "block" }, // Add this line

                ml: 1,
              }}
            >
              ONLINE ADMISSION
            </Typography>

            <Avatar src={viteLogo} sx={{ width: "30px", height: "30px" }} />

            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                flexGrow: 1,
                textTransform: "uppercase",
                ml: 1,
              }}
            >
              {schoolShortName ? schoolShortName : ""}
              {admissionYear && ` ${admissionYear}`}
            </Typography>

            <Box sx={{ display: { xs: "none", md: "flex" }, gap: "10px" }}>
              {clientInfo ? (
                <>
                  <NavButton to="/dashboard">DASHBOARD</NavButton>
                  <NavButton to="/edit-student">EDIT STUDENT</NavButton>
                  <Button sx={{ color: "black" }} onClick={handleLogout}>
                    {isLoggingOut ? <CircularProgress size={20} /> : "LOGOUT"}
                  </Button>
                </>
              ) : (
                <>
                  <NavButton to="/">HOME</NavButton>
                  <NavButton to="/contact">CONTACT US</NavButton>
                </>
              )}
            </Box>
            <IconButton
              sx={{ display: { xs: "block", md: "none" } }}
              color="inherit"
              aria-label="menu"
              onClick={handleMenuToggle}
              edge="start"
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
      </HideOnScroll>
      <Drawer
        anchor="left"
        open={menuOpen}
        onClose={handleMenuToggle}
        sx={{ display: { xs: "block", md: "none" } }}
      >
        <Box
          sx={{ width: 250, zIndex: 999 }}
          role="presentation"
          onClick={handleMenuToggle}
          onKeyDown={handleMenuToggle}
        >
          <List>
            {clientInfo ? (
              <>
                <ListItemButton
                  component={NavLink}
                  to="/dashboard"
                  sx={(theme) => ({
                    "&.active": {
                      backgroundColor: theme.palette.action.selected,
                      borderLeft: `4px solid ${theme.palette.primary.main}`,
                      fontWeight: "bold",
                    },
                  })}
                >
                  <ListItemText primary="DASHBOARD" />
                </ListItemButton>
                <ListItemButton
                  component={NavLink}
                  to="/edit-student"
                  sx={(theme) => ({
                    "&.active": {
                      backgroundColor: theme.palette.action.selected,
                      borderLeft: `4px solid ${theme.palette.primary.main}`,
                      fontWeight: "bold",
                    },
                  })}
                >
                  <ListItemText primary="EDIT STUDENT" />
                </ListItemButton>
                <ListItemButton onClick={handleLogout}>
                  <ListItemText
                    primary={
                      isLoggingOut ? <CircularProgress size={20} /> : "LOGOUT"
                    }
                  />
                </ListItemButton>
              </>
            ) : (
              <>
                <ListItemButton
                  component={NavLink}
                  to="/"
                  sx={(theme) => ({
                    "&.active": {
                      backgroundColor: theme.palette.action.selected,
                      borderLeft: `4px solid ${theme.palette.primary.main}`,
                      fontWeight: "bold",
                    },
                  })}
                >
                  <ListItemText primary="HOME" />
                </ListItemButton>
                <ListItemButton
                  component={NavLink}
                  to="/contact"
                  sx={(theme) => ({
                    "&.active": {
                      backgroundColor: theme.palette.action.selected,
                      borderLeft: `4px solid ${theme.palette.primary.main}`,
                      fontWeight: "bold",
                    },
                  })}
                >
                  <ListItemText primary="CONTACT US" />
                </ListItemButton>
              </>
            )}
          </List>
        </Box>
      </Drawer>
      <NetworkStatusWarning />
    </>
  );
};

export default Navbar;
