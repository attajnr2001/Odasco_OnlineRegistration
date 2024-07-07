import { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import {
  Button,
  InputAdornment,
  Snackbar,
  IconButton,
  Alert,
} from "@mui/material";
import { Visibility, VisibilityOff, Person } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import { useLocationIP } from "../helpers/utils";
import NetworkStatusWarning from "../helpers/NetworkStatusWarning"; // Import the component
import { useDispatch, useSelector } from "react-redux";
import { useLoginMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import { useCreateLogItemMutation } from "../slices/logApiSlice";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [createLogItem] = useCreateLogItemMutation();
  const { locationIP, loading: ipLoading } = useLocationIP();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      navigate(`/admin/dashboard/placement-actions`);
    }
  }, [navigate, userInfo]);

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login({ email, password }).unwrap();
      if (res.status === "active") {
        dispatch(setCredentials({ ...res }));

        if (!ipLoading) {
          const logsDetails = await createLogItem({
            action: "User Login",
            user: res._id,
            locationIP: locationIP || "Unknown",
          });
          console.log(logsDetails);
        } else {
          console.log("IP address not available yet");
        }

        navigate(`/admin/dashboard/placement-actions`);
      } else {
        setError("Your account is inactive. Please contact the administrator.");
      }
    } catch (err) {
      setError(err?.data?.message || err.error || "Login failed");
      console.log(err?.data?.message || err.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ height: "95vh" }}>
      <Grid
        container
        spacing={2}
        direction="column"
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: "100vh" }}
      >
        <Grid item>
          <Typography
            variant="h5"
            component="h5"
            gutterBottom
            sx={{ fontWeight: "bold", color: "#333" }}
          >
            LOGIN
          </Typography>
        </Grid>
        <Grid item>
          <TextField
            size="small"
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton edge="end">
                    <Person />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item>
          <TextField
            size="small"
            label="Password"
            variant="outlined"
            fullWidth
            margin="normal"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleTogglePasswordVisibility}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Button
          variant="contained"
          color="primary"
          onClick={handleLogin}
          sx={{ marginBottom: "10px", color: "white" }}
          disabled={loading}
        >
          {loading ? "Logging In..." : "Login"}
        </Button>
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError("")}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert severity="error">{error}</Alert>
        </Snackbar>
        <NetworkStatusWarning /> {/* Use the component here */}
      </Grid>
    </Container>
  );
};

export default Login;
