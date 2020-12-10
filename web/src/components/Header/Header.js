import React from "react";
import "./Header.css";
import { AppBar, Toolbar, IconButton, Button, Grid } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import { Link as RouterLink } from "react-router-dom";

class Header extends React.Component {
  render() {
    return (
      <div>
        <AppBar position="static">
          <Toolbar>
            <Grid container justify="flex-start">
              <Grid item>
                <Button
                  variant="contained"
                  color="secondary"
                  component={RouterLink}
                  to="/"
                >
                  Home
                </Button>
              </Grid>
            </Grid>
            <Grid container justify="flex-end">
              <Grid item>
                <Button
                  variant="contained"
                  color="secondary"
                  component={RouterLink}
                  to="/signup"
                >
                  Sign Up
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  component={RouterLink}
                  to="/login"
                >
                  Login
                </Button>
                <IconButton color="secondary" aria-label="menu">
                  <MenuIcon />
                </IconButton>
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

export default Header;
