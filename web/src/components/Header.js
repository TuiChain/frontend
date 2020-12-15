import React from "react";
import PropTypes from "prop-types";
import { AppBar, Toolbar, Button, Grid } from "@material-ui/core";
import NavMenu from "../components/NavMenu";
import { Link as RouterLink } from "react-router-dom";

const Header = (props) => {
  const { auth, onLogout } = props;

  const nav_items = auth ? (
    <Grid item>
      <NavMenu onLogout={onLogout} />
    </Grid>
  ) : (
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
    </Grid>
  );

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
            {nav_items}
          </Grid>
        </Toolbar>
      </AppBar>
    </div>
  );
};

Header.propTypes = {
  auth: PropTypes.string,
  onLogout: PropTypes.func,
};

export default Header;
