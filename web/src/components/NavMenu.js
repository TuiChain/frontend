/* eslint react/prop-types: 0 */
import { React, useState } from "react";
import { Button } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MenuIcon from "@material-ui/icons/Menu";
//import AuthService from "../services/auth.service";
import WalletService from "../services/wallet.service";
import { useHistory } from "react-router-dom";

const NavMenu = (props) => {
  const { onLogout } = props;
  const [anchorEl, setAnchorEl] = useState(null);
  const history = useHistory();

  const [wallet, setWallet] = useState(WalletService.checkAccount);
  WalletService.changeAccounts(setWallet);

  const connect_button =
    wallet == null ? (
      <Button
        variant="contained"
        color="secondary"
        onClick={() => WalletService.connectToWallet()}
      >
        Connect Wallet
      </Button>
    ) : (
      <Button variant="contained" color="secondary" disabled>
        Connected
      </Button>
    );

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

  const handleLoans = () => {
    history.push("/loans");
    setAnchorEl(null);
  };

  return (
    <div>
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
    </div>
  );
};

export default NavMenu;
