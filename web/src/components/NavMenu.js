/* eslint react/prop-types: 0 */
import { React, useState } from "react";
import { Button, Grid, withWidth } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import AccountCircle from "@material-ui/icons/AccountCircle";
//import AuthService from "../services/auth.service";
import WalletService from "../services/wallet.service";
import { useHistory } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";

const NavMenu = (props) => {
  const { onLogout, wallet, setWallet } = props;
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const [actionsAnchorEl, setActionsAnchorEl] = useState(null);
  const history = useHistory();

  const mobile = props.width === "xs" || props.width === "sm";

  WalletService.changeAccounts(setWallet);

  const handleClick = (event) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleActionsClick = (event) => {
    setActionsAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setProfileAnchorEl(null);
  };

  const handleLogout = () => {
    history.push("/");
    onLogout();
  };

  const handleActionsClose = () => {
    setActionsAnchorEl(null);
  };

  const handleLoans = () => {
    history.push("/personal/loans");
    setProfileAnchorEl(null);
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

  const studentsButton = (
    <Button
      variant="contained"
      color="secondary"
      component={RouterLink}
      to="/students"
    >
      Students
    </Button>
  );

  const dashboardButton = (
    <Button
      variant="contained"
      color="secondary"
      component={RouterLink}
      to="/dashboard"
    >
      Dashboard
    </Button>
  );

  const loanRequestButton = (
    <Button
      variant="contained"
      color="secondary"
      component={RouterLink}
      to="/request"
    >
      Request a Loan
    </Button>
  );

  const nav_items = (
    <>
      {studentsButton}
      {dashboardButton}
      {loanRequestButton}
      {connect_button}
    </>
  );

  return (
    <Grid item>
      {mobile ? (
        <>
          <IconButton
            color="secondary"
            aria-label="menu"
            aria-controls="simple-menu"
            aria-haspopup="true"
            onClick={handleActionsClick}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            anchorEl={actionsAnchorEl}
            open={Boolean(actionsAnchorEl)}
            onClose={handleActionsClose}
          >
            <MenuItem disableGutters>
              {studentsButton}
            </MenuItem>
            <MenuItem component="button" disableGutters>
              {dashboardButton}
            </MenuItem>
            <MenuItem component="button" disableGutters>
              {loanRequestButton}
            </MenuItem>
          </Menu>
        </>
      ) : (
        nav_items
      )}
      <IconButton
        color="secondary"
        aria-label="menu"
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <AccountCircle />
      </IconButton>
      <Menu
        id="simple-menu"
        anchorEl={profileAnchorEl}
        keepMounted
        open={Boolean(profileAnchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleLoans}>Loans</MenuItem>
        <MenuItem onClick={handleClose}>My account</MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </Grid>
  );
};

export default withWidth()(NavMenu);
