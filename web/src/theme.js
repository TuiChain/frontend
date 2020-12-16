import { createMuiTheme } from "@material-ui/core";

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
  },
  overrides: {
    MuiButton: {
      root: {
        borderRadius: 50,
      },
    },
  },
});

export default theme;
