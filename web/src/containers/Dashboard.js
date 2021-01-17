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
  Chip,
  Divider,
} from "@material-ui/core";
import DAI from "../components/DAI";
import ProgressBar from "../components/Progress";
import investmentService from "../services/investment.service";
import loansService from "../services/loans.service";
import userService from "../services/user.service";

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
          {loan && <Chip label={loan.state} />}
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
                  <ProgressBar completed={20} />
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
          <Button variant="outlined" color="secondary">
            Open
          </Button>
        ) : (
          <Button variant="outlined" color="secondary">
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

        {investments ? (
          <List component="nav">
            {investments.map((i) => (
              <ListItem button key={i.id} divider>
                <ListItemAvatar>
                  <Avatar alt={i.name} />
                </ListItemAvatar>

                <ListItemText primary={i.name} secondary={i.loan.course} />
                <ListItemIcon>
                  <Box
                    display="flex"
                    alignContent="center"
                    alignItems="center"
                    pr={2}
                  >
                    <Typography>
                      <Box pr={1}>{i.nrTokens}</Box>
                    </Typography>
                    <DAI />
                  </Box>
                </ListItemIcon>
                <ListItemIcon>
                  <Box color="success.main">&#x2197; 2.96%</Box>

                  {/* {i.last_24 >= 0 ? (
                              <Box color="success.main">&#x2197; {i.last_24}%</Box>
                            ) : (
                              <Box color="error.main">&#x2198; {i.last_24}%</Box>
                            )} */}
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
        <Button variant="outlined" color="secondary">
          {investments ? "Show all" : "Start investing"}
        </Button>
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

        {loans ? (
          <List component="nav">
            {loans.map((l) => (
              <ListItem button key={l.id} divider>
                <ListItemAvatar>
                  <Avatar alt={l.name} src="/static/images/avatar/1.jpg" />
                </ListItemAvatar>

                <ListItemText primary={l.course} secondary={l.school} />
                <ListItemText>
                  <Box display="flex" alignContent="center" alignItems="center">
                    <Room color="secondary" />
                    <ListItemText primary={l.destination} />
                  </Box>
                </ListItemText>

                <ListItemIcon>&#x2197; {l.price}</ListItemIcon>
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
        <Button variant="outlined" color="secondary" slot="end">
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
      const user = userService.getUser();
      setUser(user);
      setLoading(false);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchActiveLoan = async () => {
      const loan = loansService.getActiveLoan();
      setActiveLoan(loan);
    };
    fetchActiveLoan();
  }, []);

  useEffect(() => {
    const fetchInvestiments = async () => {
      const investments = investmentService.getInvestments();
      setInvestments(investments);
    };
    fetchInvestiments();
  }, []);

  useEffect(() => {
    const fetchFeaturedLoans = async () => {
      const loans = loansService.getLoans();
      setFeaturedLoans(loans);
    };
    fetchFeaturedLoans();
  }, []);

  // TODO - REMOVE
  const reset = () => {
    setActiveLoan(null);
    setInvestments(null);
    setFeaturedLoans(null);
  };

  return (
    !isLoading && (
      <Box>
        <Button onClick={reset}>TODO - REMOVE</Button>
        <Typography variant="h2" color="secondary">
          Welcome, {user.first_name} {user.last_name}!
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
