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
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();

  const { clientInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [logoutApiCall] = useLogoutMutation();

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
      setIsLoggingOut(false); // Set the loading state to false after the logout process is complete
    }
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
              ODASCO 2024
            </Typography>

            <Box sx={{ display: { xs: "none", md: "flex" }, gap: "10px" }}>
              {clientInfo ? (
                <>
                  <Button
                    component={NavLink}
                    to={`/dashboard`}
                    sx={{ color: "black" }}
                    className={({ isActive }) =>
                      isActive ? "nav-link-active" : "nav-link"
                    }
                  >
                    DASHBOARD{" "}
                  </Button>
                  <Button
                    component={NavLink}
                    to={`/dashboard/edit-student`}
                    sx={{ color: "black" }}
                    className={({ isActive }) =>
                      isActive ? "nav-link-active" : "nav-link"
                    }
                  >
                    EDIT STUDENT
                  </Button>
                  <Button sx={{ color: "black" }} onClick={handleLogout}>
                    {isLoggingOut ? <CircularProgress size={20} /> : "LOGOUT"}
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    component={NavLink}
                    to="/"
                    sx={{ color: "black" }}
                    className={({ isActive }) =>
                      isActive ? "nav-link-active" : "nav-link"
                    }
                  >
                    HOME
                  </Button>

                  <Button
                    component={NavLink}
                    to="/contact"
                    sx={{ color: "black" }}
                    className={({ isActive }) =>
                      isActive ? "nav-link-active" : "nav-link"
                    }
                  >
                    CONTACT US
                  </Button>
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
          sx={{ width: 250 }}
          role="presentation"
          onClick={handleMenuToggle}
          onKeyDown={handleMenuToggle}
        >
          <List>
            {clientInfo ? (
              <>
                <ListItemButton
                  component={NavLink}
                  to={`/dashboard`}
                  sx={(theme) => ({
                    "&.nav-link-active": {
                      backgroundColor: theme.palette.action.selected,
                    },
                  })}
                >
                  <ListItemText primary="DASHBOARD" />
                </ListItemButton>
                <ListItemButton
                  component={NavLink}
                  to={`/dashboard/edit-student`}
                  sx={(theme) => ({
                    "&.nav-link-active": {
                      backgroundColor: theme.palette.action.selected,
                    },
                  })}
                >
                  <ListItemText primary="EDIT STUDENT" />
                </ListItemButton>
                <ListItemButton
                  onClick={handleLogout}
                  sx={(theme) => ({
                    "&.nav-link-active": {
                      backgroundColor: theme.palette.action.selected,
                    },
                  })}
                >
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
                    "&.nav-link-active": {
                      backgroundColor: theme.palette.action.selected,
                    },
                  })}
                >
                  <ListItemText primary="HOME" />
                </ListItemButton>

                <ListItemButton
                  component={NavLink}
                  to="/contact"
                  sx={(theme) => ({
                    "&.nav-link-active": {
                      backgroundColor: theme.palette.action.selected,
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
