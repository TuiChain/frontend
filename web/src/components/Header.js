import React from "react";
import PropTypes from "prop-types";
import { AppBar, Toolbar, Button, Grid } from "@material-ui/core";
import NavMenu from "../components/NavMenu";
import { Link as RouterLink } from "react-router-dom";
import NavMenuAdmin from "./NavMenuAdmin";

const Header = (props) => {
  const { auth, onLogout } = props;

  const account_btns = (
    <>
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
    </>
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
            {auth ? (
              auth.is_admin ? (
                <NavMenuAdmin onLogout={onLogout} />
              ) : (
                <NavMenu onLogout={onLogout} />
              )
            ) : (
              auth !== null && account_btns
            )}
          </Grid>
        </Toolbar>
      </AppBar>
    </div>
  );
};

Header.propTypes = {
  auth: PropTypes.oneOfType([
    PropTypes.object, // user token & type
    PropTypes.bool, // no auth token (false)
  ]),
  onLogout: PropTypes.func,
};

export default Header;
