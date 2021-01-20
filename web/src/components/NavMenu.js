/* eslint react/prop-types: 0 */
import { React, useState } from "react";
import { Button, Grid } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MenuIcon from "@material-ui/icons/Menu";
//import AuthService from "../services/auth.service";
import WalletService from "../services/wallet.service";
import { useHistory } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";

const NavMenu = (props) => {
  const { onLogout, wallet, setWallet } = props;
  const [anchorEl, setAnchorEl] = useState(null);
  const history = useHistory();

  WalletService.changeAccounts(setWallet);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    history.push("/");
    onLogout();
  };

  const connect_button =
    wallet == null ? (
      <Button
        variant="contained"
        color="secondary"
        onClick={() => WalletService.connectToWallet()}
      >
        Connect Wallet
      </Button>
    ) : wallet != 0 ? (
      <Button variant="contained" color="secondary" disabled>
        Connected
      </Button>
    ) : (
      <Button
        variant="contained"
        color="secondary"
        onClick={() => window.open("https://metamask.io/")}
      >
        Install Metamask
      </Button>
    );

  const nav_items = (
    <>
      <Button
        variant="contained"
        color="secondary"
        component={RouterLink}
        to="/students"
      >
        Students
      </Button>
      <Button
        variant="contained"
        color="secondary"
        component={RouterLink}
        to="/dashboard"
      >
        Dashboard
      </Button>
      <Button
        variant="contained"
        color="secondary"
        component={RouterLink}
        to="/request"
      >
        Request a Loan
      </Button>
    </>
  );

  const handleLoans = () => {
    history.push("/personal/loans");
    setAnchorEl(null);
  };

  return (
    <Grid item>
      {nav_items}
      {connect_button}
      <IconButton
        color="secondary"
        aria-label="menu"
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MenuIcon />
      </IconButton>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleLoans}>Loans</MenuItem>
        <MenuItem onClick={handleClose}>My account</MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </Grid>
  );
};

export default NavMenu;
