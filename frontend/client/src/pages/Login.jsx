import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import {
  Badge,
  Box,
  Typography,
  Avatar,
  Snackbar,
  Alert,
  Button,
  TextField,
} from "@mui/material";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import CrisisAlertIcon from "@mui/icons-material/CrisisAlert";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import MuiAccordion from "@mui/material/Accordion";
import { useNavigate } from "react-router-dom";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import { useParams } from "react-router-dom";
import NetworkStatusWarning from "../helpers/NetworkStatusWarning";
import viteLogo from "/logo.jpg";
import PaystackPop from "@paystack/inline-js";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useLoginMutation } from "../slices/clientApiSlice";
import { setCredentials } from "../slices/authSlice";
import { useUpdatePaymentStatusMutation } from "../slices/clientApiSlice";
import { useGetSchoolItemsQuery } from "../slices/schoolApiSlice";

const StyledBadge = styled(Badge, {
  shouldForwardProp: (prop) =>
    prop !== "admissionStatus" && prop !== "isClosingSoon",
})(({ theme, admissionStatus, isClosingSoon }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: isClosingSoon
      ? "#ff9800" // yellow
      : admissionStatus
      ? "#44b700" // green if admissionStatus is true
      : "#d32f2f", // red if false
    color: isClosingSoon
      ? "#ff9800" // yellow
      : admissionStatus
      ? "#44b700" // green if admissionStatus is true
      : "#d32f2f", // red if false
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&::before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, .05)"
      : "rgba(0, 0, 0, .03)",
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));

const Login = () => {
  const [expanded, setExpanded] = useState("panel1");
  const [error, setError] = useState("");
  const [indexNumber, setIndexNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState(false);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isClosingSoon, setIsClosingSoon] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();
  const [updatePaymentStatus] = useUpdatePaymentStatusMutation();
  const { clientInfo } = useSelector((state) => state.auth);
  const { data: schoolItems, isLoading: isLoadingSchool } =
    useGetSchoolItemsQuery();

  const school = schoolItems?.[0];

  // useEffect(() => {
  //   if (clientInfo) {
  //     navigate(`/dashboard/`);
  //   } else {
  //   }
  // }, [navigate, clientInfo]);
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!school?.admissionStatus) {
      setError("Admission is currently closed. Please check back later.");
      return;
    }

    setLoading(true);
    try {
      // Remove the last two digits from the index number
      const truncatedIndexNumber = indexNumber.slice(0, -2);

      const res = await login({ indexNumber: truncatedIndexNumber }).unwrap();

      if (!res.hasPaid) {
        payment(res);
      } else {
        dispatch(setCredentials({ ...res }));
        if (res.completed) {
          navigate(`/dashboard`);
        } else {
          navigate(`/dashboard/edit-student`);
        }
      }
    } catch (err) {
      setError(err?.data?.message || err.error || "Login failed");
      console.log(err?.data?.message || err.error);
    } finally {
      setLoading(false);
    }
  };

  const payment = (studentData) => {
    if (!school || typeof school.serviceCharge !== "number") {
      setError("Unable to process payment. Please try again later.");
      return;
    }

    const payStack = new PaystackPop();
    payStack.newTransaction({
      key: process.env.PAYSTACK_TEST_KEY,
      amount: school.serviceCharge * 100,
      email: "attajnr731@gmail.com",
      onSuccess: () => handlePaymentSuccess(studentData),
      onCancel: () => {
        setMessage("Payment cancelled");
        setOpen(true);
      },
    });
  };

  const handlePaymentSuccess = async (studentData) => {
    try {
      const result = await updatePaymentStatus(studentData._id).unwrap();
      dispatch(setCredentials(result));
      navigate(`/dashboard/edit-student`);
    } catch (error) {
      setMessage("Error updating payment status");
      setOpen(true);
    }
  };

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="85vh"
        textAlign="center"
        flexDirection="column"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <StyledBadge
            overlap="circular"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            variant="dot"
            admissionStatus={school?.admissionStatus}
            isClosingSoon={isClosingSoon}
          >
            <Avatar
              src={viteLogo}
              sx={{ width: "5rem", height: "5rem", my: 3 }}
              alt={school?.name}
            />
          </StyledBadge>
        </motion.div>

        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", mb: 2, textTransform: "uppercase" }}
        >
          WELCOME TO THE {school?.name} ONLINE SHS PLATFORM
        </Typography>
        <Typography sx={{ mb: 2, textTransform: "uppercase" }}>
          Help Desk Number: {school?.helpDeskNo} / {school?.phone}
        </Typography>

        <div>
          <Accordion
            expanded={expanded === "panel1"}
            onChange={handleChange("panel1")}
          >
            <AccordionSummary
              aria-controls="panel1d-content"
              id="panel1d-header"
            >
              <Typography
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <CrisisAlertIcon color="warning" />
                ADMISSION INSTRUCTIONS
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Enter your B.E.C.E Index Number followed by the year. Eg
                (100000000024)
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion
            expanded={expanded === "panel2"}
            onChange={handleChange("panel2")}
          >
            <AccordionSummary
              aria-controls="panel2d-content"
              id="panel2d-header"
            >
              <Typography
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <ErrorOutlineIcon color="error" />
                VERY IMPORTANT NOTICE
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Please ensure that you have printed your CSSPS PLACEMENT FORM.
                Your ENROLMENT CODE, which can be found on your Placement Form,
                would be REQUIRED by this system. Your admission is NOT complete
                without your Enrolment Code.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <TextField
            label="JHS Index Number"
            sx={{ mt: 4, width: "300px" }}
            size="small"
            onChange={(e) => setIndexNumber(e.target.value)}
            value={indexNumber}
          />

          <br />
          <Button
            variant="contained"
            color="primary"
            onClick={handleLogin}
            sx={{
              my: "10px",
              color: "white", 
            }}
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
        </div>
      </Box>
      <NetworkStatusWarning />
    </>
  );
};

export default Login;
