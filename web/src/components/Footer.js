/* eslint react/prop-types: 0 */

import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { AppBar, Toolbar, IconButton, Button, Grid } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";

const Footer = () => {
  return (
    <AppBar position="static" color="secondary">
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
  );
};

export default Footer;
