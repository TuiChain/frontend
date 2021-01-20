/* eslint react/prop-types: 0 */
import { React, useState } from "react";
import {
  Button,
  Grid,
  withWidth,
  IconButton,
  Divider,
  ListItem,
  ListItemIcon,
  ListItemText,
  Drawer,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import WalletService from "../services/wallet.service";
import { useHistory } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import BorderColorIcon from "@material-ui/icons/BorderColor";
import ViewComfyIcon from "@material-ui/icons/ViewComfy";
import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import AccountBalanceIcon from "@material-ui/icons/AccountBalance";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: "flex-start",
  },
}));

const NavMenu = (props) => {
  const classes = useStyles();
  const { onLogout, wallet, setWallet } = props;

  const history = useHistory();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const mobile = props.width === "xs" || props.width === "sm";

  WalletService.changeAccounts(setWallet);

  const handleLogout = () => {
    history.push("/");
    onLogout();
  };

  const handleAction = (path) => {
    history.push(path);
    setDrawerOpen(false);
  };

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
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

  const DrawerItem = ({ item }) => {
    return (
      <ListItem button onClick={item.handler} key={item.text}>
        <ListItemIcon>{item.icon}</ListItemIcon>
        <ListItemText primary={item.text} />
      </ListItem>
    );
  };

  const actionsDrawerDivision = [
    {
      text: "Students",
      handler: () => handleAction("/students"),
      icon: <MonetizationOnIcon />,
    },
    {
      text: "Dashboard",
      handler: () => handleAction("/dashboard"),
      icon: <ViewComfyIcon />,
    },
    {
      text: "Request a Loan",
      handler: () => handleAction("/request"),
      icon: <BorderColorIcon />,
    },
  ];

  const profileDrawerDivision = [
    {
      text: "Loans",
      handler: () => handleAction("/personal/loans"),
      icon: <AccountBalanceIcon />,
    },
    {
      text: "My Account",
      handler: handleDrawerClose,
      icon: <AccountBoxIcon />,
    },
    {
      text: "Logout",
      handler: handleLogout,
      icon: <ExitToAppIcon />,
    },
  ];

  return (
    <Grid item>
      {mobile ? connect_button : nav_items}
      <IconButton
        color="secondary"
        aria-label="menu"
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleDrawerOpen}
      >
        <MenuIcon />
      </IconButton>
      <Drawer
        className={classes.drawer}
        anchor="right"
        open={drawerOpen}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronRightIcon />
          </IconButton>
        </div>
        {mobile && (
          <>
            <Divider />
            <List>
              {actionsDrawerDivision.map((option) => (
                <DrawerItem key={option.text} item={option} />
              ))}
            </List>
          </>
        )}
        <Divider />
        <List>
          {profileDrawerDivision.map((option) => (
            <DrawerItem key={option.text} item={option} />
          ))}
        </List>
      </Drawer>
    </Grid>
  );
};

export default withWidth()(NavMenu);
