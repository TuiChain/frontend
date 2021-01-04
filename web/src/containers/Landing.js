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
  Hidden,
  CardHeader,
} from "@material-ui/core";
import { loadCSS } from "fg-loadcss";
import world from "../assets/images/world.jpg";

const useStyles = makeStyles((theme) => ({
  main: {
    height: "96vh",
  },
  secondary: {
    backgroundColor: theme.palette.secondary.main,
    height: "10vh",
  },
}));

// Load FontAwesome icons - todo
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

const useTestimonialsStyles = makeStyles((theme) => ({
  cardHeader: {
    backgroundColor: theme.palette.primary.main,
  },
}));

const Testimonial = ({ testimonial, name, job }) => {
  const classes = useTestimonialsStyles();

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h4">
          <Box color="secondary.dark">{testimonial}</Box>
        </Typography>
      </CardContent>
      <CardHeader
        className={classes.cardHeader}
        title={name}
        subheader={job}
      ></CardHeader>
    </Card>
  );
};

Testimonial.propTypes = {
  testimonial: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  job: PropTypes.string.isRequired,
};

const Landing = () => {
  const classes = useStyles();

  return (
    <>
      <Box
        bgcolor="primary.main"
        className={classes.main}
        display="flex"
        alignItems="center"
      >
        <Grid container>
          <Grid xs={12} md={7} item>
            <Typography variant="h1">
              <Box color="secondary.dark">TUICHAIN</Box>
            </Typography>
            <Typography variant="h5">
              <Box color="secondary.contrastText">
                lorem lorem lorem lorem lorem
              </Box>
            </Typography>
          </Grid>
          <Hidden smDown>
            <Grid md={5} item>
              <Typography variant="h1">
                <Box color="secondary.dark">IMAGEM</Box>
              </Typography>
            </Grid>
          </Hidden>
        </Grid>
      </Box>
      <Box p={10}>
        <Box mx={10}>
          <Typography variant="h2" align="center">
            <Box color="secondary.dark">Some text</Box>
          </Typography>
          <Grid container spacing={6} justify="center" alignContent="center">
            <Grid xs={12} sm={6} md={3} item>
              <Feature icon="fa fa-plus-circle" name="Ola" desc="teste" />
            </Grid>
            <Grid xs={12} sm={6} md={3} item>
              <Feature icon="fa fa-plus-circle" name="Ola" desc="teste" />
            </Grid>
            <Grid xs={12} sm={6} md={3} item>
              <Feature icon="fa fa-plus-circle" name="Ola" desc="teste" />
            </Grid>
            <Grid xs={12} sm={6} md={3} item>
              <Feature icon="fa fa-plus-circle" name="Ola" desc="teste" />
            </Grid>
          </Grid>
        </Box>
        cards: active users stuents satisfied
      </Box>
      <Box bgcolor="secondary.main" p={10}>
        <Typography variant="h2" align="center">
          <Box color="secondary.contrastText">Bring Education to the World</Box>
        </Typography>
        <img src={world} alt="Logo" />
      </Box>

      <Box p={10}>
        <Typography variant="h2" align="center">
          <Box color="secondary.dark">Our Testimonials</Box>
        </Typography>
        <Testimonial testimonial="Teste" name="teste" job="teste" />
      </Box>
    </>
  );
};

export default Landing;
