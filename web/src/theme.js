import {
  unstable_createMuiStrictModeTheme as createMuiTheme,
  responsiveFontSizes,
} from "@material-ui/core";

const theme = createMuiTheme({
  palette: {
    primary: {
      light: "#55DBD4",
      main: "#3AAFA9",
      dark: "#109D96",
      contrastText: "#fff",
    },
    secondary: {
      light: "#293A41",
      main: "#1D2E34",
      dark: "#131E22",
      contrastText: "#fff",
    },
    background: {
      root: "#FCFCFC",
      paper: "white",
    },
    error: {
      light: "#FF6161",
      main: "#ED2E50",
      dark: "#C30023",
      contrastText: "#fff",
    },
    phase: {
      funding: "#F5B300",
      expired: "#ED2E50",
      canceled: "#ED2E50",
      withdrawn: "#ED2E50",
      active: "#58C400",
      finalized: "#293A41",
      pending: "#109D96",
      rejected: "#ED2E50",
    },
  },
  overrides: {
    MuiButton: {
      root: {
        borderRadius: 50,
        margin: "8px",
      },
      outlined: {
        backgroundColor: "white",
      },
    },
    MuiOutlinedInput: {
      root: {
        borderRadius: 10,
        backgroundColor: "white",
      },
    },
    MuiPickersBasePicker: {
      pickerView: {
        backgroundColor: "white",
      },
    },
    MuiListItem: {
      root: {
        "&$selected": {
          backgroundColor: "#c2c2c2",
          "&:hover": {
            backgroundColor: "#c2c2c2",
          },
        },
      },
      button: {
        backgroundColor: "white",
        "&:hover": {
          backgroundColor: "#c2c2c2",
        },
      },
    },
  },
});

export default responsiveFontSizes(theme);
