import { unstable_createMuiStrictModeTheme as createMuiTheme } from "@material-ui/core";

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
    PrivateNotchedOutline: {
      root: {
        borderWidth: "0px",
      },
    },
    MuiSelect: {
      select: {
        "&:focus": {
          backgroundColor: "transparent",
        },
      },
    },
    MuiCheckbox: {
      root: {
        color: "#D7D8E7",
      },
    },
    MuiSvgIcon: {
      root: {
        width: "0.8em",
        height: "0.8em",
      },
    },
  },
});

export default theme;
