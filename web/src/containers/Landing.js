import React, { useEffect } from "react";
import PropTypes from "prop-types";
import {
  Box,
  makeStyles,
  Typography,
  Card,
  CardContent,
  Grid,
  Icon,
} from "@material-ui/core";
import { loadCSS } from "fg-loadcss";

const useStyles = makeStyles((theme) => ({
  main: {
    height: "100vh",
  },
  secondary: {
    backgroundColor: theme.palette.secondary.main,
    height: "10vh",
  },
}));

// Load FontAwesome icons
const useIcons = () => {
  useEffect(() => {
    const node = loadCSS(
      "https://use.fontawesome.com/releases/v5.12.0/css/all.css",
      document.querySelector("#font-awesome-css")
    );

    return () => {
      node.parentNode.removeChild(node);
    };
  }, []);
};

const Feature = ({ icon, name, desc }) => {
  useIcons();

  return (
    <Card variant="outlined">
      <CardContent>
        <Icon className={icon} style={{ fontSize: 50 }} color="secondary" />
        <Typography variant="h4">
          <Box color="secondary.dark">{name}</Box>
        </Typography>
        <Typography color="textSecondary">{desc}</Typography>
      </CardContent>
    </Card>
  );
};

Feature.propTypes = {
  icon: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  desc: PropTypes.string.isRequired,
};

// const Review = () => {};

const Landing = () => {
  const classes = useStyles();

  return (
    <>
      <Box bgcolor="primary.main" className={classes.main}>
        <Typography variant="h1">
          <Box color="secondary.dark">Landing</Box>
        </Typography>
      </Box>
      <Box>
        <Grid container spacing={4} justify="center" alignContent="center">
          <Grid sm={6} md={3} item>
            <Feature icon="fa fa-plus-circle" name="Ola" desc="teste" />
          </Grid>
          <Grid sm={6} md={3} item>
            <Feature icon="fa fa-plus-circle" name="Ola" desc="teste" />
          </Grid>
          <Grid sm={6} md={3} item>
            <Feature icon="fa fa-plus-circle" name="Ola" desc="teste" />
          </Grid>
          <Grid sm={6} md={3} item>
            <Feature icon="fa fa-plus-circle" name="Ola" desc="teste" />
          </Grid>
        </Grid>
        cards: active users stuents satisfied
      </Box>
      <Box bgcolor="secondary.main">
        Mapa do mundo, levar a educação a todo o lado
      </Box>

      <Box>Our users: lista de testemunhos</Box>
    </>
  );
};

export default Landing;
