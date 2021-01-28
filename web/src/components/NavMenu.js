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
import MuseumIcon from "@material-ui/icons/Museum";
import ShowChartIcon from "@material-ui/icons/ShowChart";

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
  divider: {
    background: theme.palette.secondary.main,
  },
}));

const NavMenu = (props) => {
  const classes = useStyles();
  const { onLogout, wallet } = props;

  const history = useHistory();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const mobile = props.width === "xs" || props.width === "sm";

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

  const loansButton = (
    <Button
      variant="contained"
      color="secondary"
      component={RouterLink}
      to="/loans"
    >
      Loans
    </Button>
  );

  const marketButton = (
    <Button
      variant="contained"
      color="secondary"
      component={RouterLink}
      to="/market"
    >
      Market
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

  const nav_items = (
    <>
      {dashboardButton}
      {loansButton}
      {marketButton}
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
      text: "Dashboard",
      handler: () => handleAction("/dashboard"),
      icon: <ViewComfyIcon color="secondary" />,
    },
    {
      text: "Loans",
      handler: () => handleAction("/loans"),
      icon: <MonetizationOnIcon color="secondary" />,
    },
    {
      text: "Market",
      handler: () => handleAction("/market"),
      icon: <MuseumIcon color="secondary" />,
    },
    {
      text: "Request a Loan",
      handler: () => handleAction("/request"),
      icon: <BorderColorIcon color="secondary" />,
    },
  ];

  const profileDrawerDivision = [
    {
      text: "My Loans",
      handler: () => handleAction("/personal/loans"),
      icon: <AccountBalanceIcon color="secondary" />,
    },
    {
      text: "My Investments",
      handler: () => handleAction("/investments"),
      icon: <ShowChartIcon color="secondary" />,
    },
    {
      text: "My Account",
      handler: () => handleAction("/personal/profile"),
      icon: <AccountBoxIcon color="secondary" />,
    },
    {
      text: "Logout",
      handler: handleLogout,
      icon: <ExitToAppIcon color="secondary" />,
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
        <MenuIcon style={{ fontSize: 32 }} />
      </IconButton>
      <Drawer
        className={classes.drawer}
        anchor="right"
        open={drawerOpen}
        classes={{
          paper: classes.drawerPaper,
        }}
        onEscapeKeyDown={handleDrawerClose}
        onBackdropClick={handleDrawerClose}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronRightIcon fontSize="large" color="secondary" />
          </IconButton>
        </div>
        {mobile && (
          <>
            <Divider className={classes.divider} />
            <List>
              {actionsDrawerDivision.map((option) => (
                <DrawerItem key={option.text} item={option} />
              ))}
            </List>
          </>
        )}
        <Divider className={classes.divider} />
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
