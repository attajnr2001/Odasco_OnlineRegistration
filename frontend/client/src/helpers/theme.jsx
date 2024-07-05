import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#2bd918",
    },
  },
  typography: {
    fontFamily: ["Poppins"].join(","),
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          color: "white",
          "&:hover": {
            color: "white",
          },
        },
        contained: {
          "&:hover": {
            color: "white",
          },
        },
        outlined: {
          color: "inherit",
          "&:hover": {
            color: "inherit",
          },
        },
        text: {
          color: "inherit",
          "&:hover": {
            color: "inherit",
          },
        },
      },
    },
  },
});

export default theme;
