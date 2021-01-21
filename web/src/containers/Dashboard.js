import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Create, School, Room } from "@material-ui/icons";
import {
  Typography,
  Box,
  Grid,
  CardContent,
  Card,
  CardActions,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemAvatar,
  Avatar,
  ListItemText,
  makeStyles,
  Divider,
} from "@material-ui/core";
import DAI from "../components/DAI";
import ProgressBar from "../components/Progress";
import investmentService from "../services/investment.service";
import loansService from "../services/loans.service";
import userService from "../services/user.service";
import Status from "../components/Status";
import { Link as RouterLink } from "react-router-dom";

const useStyles = makeStyles({
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  actions: {
    justifyContent: "flex-end",
    flexGrow: 1,
    alignItems: "flex-end",
  },
});

const ActiveLoan = ({ loan }) => {
  const classes = useStyles();

  return (
    <Card elevation={2} className={classes.card}>
      <CardContent>
        <Box
          pb={2}
          display="flex"
          alignContent="center"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography variant="h3" color="secondary">
            Active Loan
          </Typography>
          {loan && <Status state={loan.state} />}
        </Box>

        {loan ? (
          <>
            <List>
              <ListItem>
                <ListItemIcon>
                  <Create color="secondary" />
                </ListItemIcon>
                <ListItemText primary={loan.course} />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemIcon>
                  <School color="secondary" />
                </ListItemIcon>
                <ListItemText primary={loan.school} />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemIcon>
                  <Room color="secondary" />
                </ListItemIcon>
                <ListItemText primary={loan.destination} />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemIcon>
                  <DAI />
                </ListItemIcon>
                <ListItemText>
                  <ProgressBar
                    completed={(loan.funded_value * 100) / loan.requested_value}
                  />
                </ListItemText>
              </ListItem>
              <Divider />
            </List>
          </>
        ) : (
          <>No active request...</>
        )}
      </CardContent>
      <CardActions className={classes.actions}>
        {loan ? (
          <Button
            variant="outlined"
            color="secondary"
            component={RouterLink}
            to={`/students/${loan.id}`}
          >
            Open
          </Button>
        ) : (
          <Button
            variant="outlined"
            color="secondary"
            component={RouterLink}
            to="/request"
          >
            Make a request
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

ActiveLoan.propTypes = {
  loan: PropTypes.object,
};

const Investments = ({ investments }) => {
  const classes = useStyles();

  return (
    <Card elevation={2} className={classes.card}>
      <CardContent>
        <Typography variant="h3" color="secondary" gutterBottom>
          Investments
        </Typography>

        {investments && investments.length > 0 ? (
          <List component="nav">
            {investments.map((i) => (
              <ListItem
                button
                key={i.loan.id}
                divider
                component={RouterLink}
                to="/investments"
              >
                <ListItemAvatar>
                  <Avatar>{i.name.charAt(0)}</Avatar>
                </ListItemAvatar>

                <ListItemText primary={i.name} secondary={i.loan.course} />
                <ListItemIcon>
                  <Box
                    display="flex"
                    alignContent="center"
                    alignItems="center"
                    pr={2}
                  >
                    <Box pr={1}>{i.nrTokens}</Box>
                    <DAI />
                  </Box>
                </ListItemIcon>
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography variant="body2" component="p">
            No investments...
          </Typography>
        )}
      </CardContent>
      <CardActions className={classes.actions}>
        {investments && investments.length > 0 ? (
          <Button
            variant="outlined"
            color="secondary"
            component={RouterLink}
            to="/investments"
          >
            Show all
          </Button>
        ) : (
          <Button
            variant="outlined"
            color="secondary"
            component={RouterLink}
            to="/students"
          >
            Start investing
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

Investments.propTypes = {
  investments: PropTypes.array,
};

const FeaturedLoans = ({ loans }) => {
  const classes = useStyles();

  return (
    <Card elevation={2} className={classes.card}>
      <CardContent>
        <Typography variant="h3" color="secondary" gutterBottom>
          Featured Loans
        </Typography>

        {loans && loans.length > 0 ? (
          <List component="nav">
            {loans.map((l) => (
              <ListItem
                button
                key={l.id}
                divider
                component={RouterLink}
                to={`/students/${l.id}`}
              >
                <ListItemAvatar>
                  <Avatar>{l.user_full_name ? l.user_full_name.charAt(0) : 'fjhsbsf shabhs'}</Avatar>
                </ListItemAvatar>

                <ListItemText primary={l.course} secondary={l.school} />

                <ListItemIcon>
                  <Box
                    display="flex"
                    alignContent="center"
                    alignItems="center"
                    pr={2}
                  >
                    <Box pr={1}>
                      {l.funded_value}/{l.requested_value}
                    </Box>
                    <DAI />
                  </Box>
                </ListItemIcon>
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography variant="body2" component="p">
            No loans...
          </Typography>
        )}
      </CardContent>
      <CardActions className={classes.actions}>
        <Button
          variant="outlined"
          color="secondary"
          slot="end"
          component={RouterLink}
          to="/students"
        >
          Explore
        </Button>
      </CardActions>
    </Card>
  );
};

FeaturedLoans.propTypes = {
  loans: PropTypes.array,
};

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [active_loan, setActiveLoan] = useState(null);
  const [investments, setInvestments] = useState(null);
  const [featured_loans, setFeaturedLoans] = useState(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await userService.getCurrentUserInfo();
      setUser(user);
      setLoading(false);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchActiveLoan = async () => {
      const loan = await loansService.getActiveLoan();
      setActiveLoan(loan);
    };
    fetchActiveLoan();
  }, []);

  useEffect(() => {
    const fetchInvestiments = async () => {
      const investments = await investmentService.getDashboardInvestments();
      setInvestments(investments);
    };
    fetchInvestiments();
  }, []);

  useEffect(() => {
    const fetchFeaturedLoans = async () => {
      const loans = await loansService.getFeaturedLoans();
      setFeaturedLoans(loans);
    };
    fetchFeaturedLoans();
  }, []);

  return (
    !isLoading && (
      <Box>
        <Typography variant="h2" color="secondary">
          Welcome, @{user.username}!
        </Typography>
        <Box paddingTop={3}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <ActiveLoan loan={active_loan} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Investments investments={investments} />
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Box paddingTop={4}>
              <FeaturedLoans loans={featured_loans} />
            </Box>
          </Grid>
        </Box>
      </Box>
    )
  );
};

export default Dashboard;
