import React, { useState, useEffect } from "react";
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
} from "@material-ui/core";

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

const Dashboard = () => {
  const classes = useStyles();
  const [active_request, setActiveRequest] = useState(null);
  const [investments, setInvestments] = useState(null);
  const [featured_loans, setFeaturedLoans] = useState(null);
  useEffect(() => {
    const fetchUser = () => {
      setActiveRequest({ id: 1, course: "ola", school: "Adeus" });
      setInvestments([
        {
          // id
          // id investidor
          // id loan request
          // amount
          // data,
          id: 1,
          course: "ola",
          school: "Adeus",
          price: 20,
          last_24: -4.21,
          name: "Pedro",
        },
        {
          id: 2,
          course: "ola",
          school: "Adeus",
          price: 20,
          last_24: 4.21,
          name: "Pedro",
        },
      ]);
      setFeaturedLoans([
        {
          id: 1,
          course: "ola",
          school: "Adeus",
          price: 20,
          last_24: -4.21,
          name: "Pedro",
        },
        {
          id: 2,
          course: "ola",
          school: "Adeus",
          price: 20,
          last_24: 4.21,
          name: "Pedro",
        },
      ]);
    };
    fetchUser();
  }, []);

  const reset = () => {
    setActiveRequest(null);
    setInvestments(null);
    setFeaturedLoans(null);
  };

  return (
    <Box>
      <Button onClick={reset}>to remove</Button>
      <Typography variant="h2" color="secondary">
        Welcome, user.name!
      </Typography>
      <Box paddingTop={3}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card elevation={2} className={classes.card}>
              <CardContent>
                <Typography variant="h3" color="secondary" gutterBottom>
                  Active Loan
                </Typography>

                {active_request ? (
                  <ListItem button key={active_request.id}>
                    <ListItemAvatar>
                      <Avatar
                        alt={active_request.school}
                        src="/static/images/avatar/1.jpg"
                      />
                    </ListItemAvatar>

                    <ListItemText primary={active_request.course} />

                    <ListItemIcon>
                      <Chip label="OLA" />
                    </ListItemIcon>
                  </ListItem>
                ) : (
                  <>No active request...</>
                )}
              </CardContent>
              <CardActions className={classes.actions}>
                {!active_request && (
                  <Button variant="outlined" color="secondary">
                    Make a request
                  </Button>
                )}
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box>
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
                            <Avatar
                              alt={i.name}
                              src="/static/images/avatar/1.jpg"
                            />
                          </ListItemAvatar>

                          <ListItemText
                            primary={i.name}
                            secondary={i.course + ", " + i.school}
                          />
                          <ListItemIcon>{i.price} DAI</ListItemIcon>
                          <ListItemIcon>
                            {i.last_24 >= 0 ? (
                              <Box color="success.main">
                                &#x2197; {i.last_24}%
                              </Box>
                            ) : (
                              <Box color="error.main">
                                &#x2198; {i.last_24}%
                              </Box>
                            )}
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
            </Box>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Box paddingTop={4}>
            <Card elevation={2} className={classes.card}>
              <CardContent>
                <Typography variant="h3" color="secondary" gutterBottom>
                  Featured Loans
                </Typography>

                {featured_loans ? (
                  <List component="nav">
                    {featured_loans.map((l) => (
                      <ListItem button key={l.id} divider>
                        <ListItemAvatar>
                          <Avatar
                            alt={l.name}
                            src="/static/images/avatar/1.jpg"
                          />
                        </ListItemAvatar>

                        <ListItemText
                          primary={l.name}
                          secondary={l.course + ", " + l.school}
                        />
                        <ListItemIcon>&#x2197; {l.price}</ListItemIcon>
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
                <Button variant="outlined" color="secondary" slot="end">
                  Explore
                </Button>
              </CardActions>
            </Card>
          </Box>
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard;
