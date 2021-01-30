import React from "react";
import PropTypes from "prop-types";
import {
  AppBar,
  Toolbar,
  Button,
  Grid,
  IconButton,
  useScrollTrigger,
} from "@material-ui/core";
import NavMenu from "../components/NavMenu";
import { Link as RouterLink } from "react-router-dom";
import NavMenuAdmin from "./NavMenuAdmin";
import Logo from "./Logo";

const Header = (props) => {
  const { auth, onLogout, wallet, setWallet, landing } = props;

  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 1,
  });

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
    <AppBar
      position="sticky"
      style={{ boxShadow: landing && !trigger &&  "none" }}
    >
      <Toolbar>
        <IconButton
          variant="contained"
          color="secondary"
          component={RouterLink}
          to="/"
        >
          <Logo />
        </IconButton>
        <Grid container justify="flex-end">
          {auth ? (
            auth.is_admin ? (
              <NavMenuAdmin onLogout={onLogout} />
            ) : (
              <NavMenu
                onLogout={onLogout}
                wallet={wallet}
                setWallet={setWallet}
              />
            )
          ) : (
            auth !== null && account_btns
          )}
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

Header.propTypes = {
  auth: PropTypes.oneOfType([
    PropTypes.object, // user token & type
    PropTypes.bool, // no auth token (false)
  ]),
  onLogout: PropTypes.func,
  wallet: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number, // 0 - uninstalled
  ]),
  setWallet: PropTypes.func,
  landing: PropTypes.bool,
};

export default Header;
