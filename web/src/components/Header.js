import React, { useState } from "react";
import PropTypes from "prop-types";
import { AppBar, Toolbar, Button, Grid } from "@material-ui/core";
import NavMenu from "../components/NavMenu";
import { Link as RouterLink } from "react-router-dom";
import WalletService from "../services/wallet.service";

const Header = (props) => {
  const { auth, onLogout} = props;
  const [wallet, setWallet] = useState(WalletService.checkAccount);

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

  WalletService.changeAccounts(setWallet);

  const connect_button = wallet == null ? 
    (
      <Button
        variant="contained"
        color="secondary"
        onClick={() => WalletService.connectToWallet()}
      >
        Connect Wallet
      </Button>
    ) : (
      <Button
        variant="contained"
        color="secondary"
        disabled
      >
        Connected
      </Button>
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
            {connect_button}
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
