import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Box,
  makeStyles,
  Typography,
  Card,
  CardContent,
  Grid,
  Hidden,
  CardHeader,
  Stepper,
  Step,
  StepLabel,
  Button,
  SvgIcon,
} from "@material-ui/core";
import Carousel from "react-material-ui-carousel";
import world from "../assets/images/world.jpg";
import logo from "../assets/images/logo-white.png";
import { ReactComponent as Quote } from "../assets/icons/left-quote.svg";
import { ReactComponent as PeopleCarry } from "../assets/icons/people-carry-solid.svg";
import { ReactComponent as Handshake } from "../assets/icons/handshake-solid.svg";
import { ReactComponent as Ethereum } from "../assets/icons/ethereum-brands.svg";
import { ReactComponent as Infinity } from "../assets/icons/infinity-solid.svg";

const useStyles = makeStyles((theme) => ({
  main: {
    height: "96vh",
  },
  secondary: {
    backgroundColor: theme.palette.secondary.main,
    height: "10vh",
  },
  img: {
    marginRight: "-40%",
    "@media screen and (min-width: 960px)": {
      width: "600px",
    },
    "@media screen and (min-width: 1280px)": {
      width: "700px",
    },
    "@media screen and (min-width: 1500px)": {
      width: "750px",
      marginRight: "-30%",
    },
  },
  features: {
    "@media screen and (min-width: 600px)": {
      margin: "0 5%",
    },
  },
}));

const Feature = ({ icon, name, desc, viewBox }) => {
  return (
    <Card variant="outlined" style={{ height: "100%", maxWidth: "300px" }}>
      <CardContent
        style={{ height: "100%", display: "flex", flexDirection: "column" }}
      >
        <Box display="flex" justifyContent="center">
          <SvgIcon
            component={icon}
            style={{ fontSize: 100 }}
            color="secondary"
            viewBox={viewBox}
          />
        </Box>
        <Box
          color="secondary.dark"
          pt={2}
          display="flex"
          justifyContent="center"
        >
          <Typography align="center" variant="h4">
            {name}
          </Typography>
        </Box>
        <Box pt={2}>
          <Typography align="center" color="textSecondary">
            {desc}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

Feature.propTypes = {
  icon: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  desc: PropTypes.string.isRequired,
  viewBox: PropTypes.string.isRequired,
};

const useTestimonialsStyles = makeStyles((theme) => ({
  cardHeader: {
    backgroundColor: theme.palette.primary.dark,
  },
}));

/* eslint-disable no-unused-vars */
const Testimonial = ({ testimonial, name, job }) => {
  const classes = useTestimonialsStyles();

  return (
    <Box maxWidth={600} margin="0 auto">
      <Card variant="outlined">
        <CardContent>
          <Box display="flex" justifyContent="flex-end" pr={4}>
            <SvgIcon
              color="secondary"
              style={{ fontSize: 50 }}
              viewBox="0 0 95.3 95.3"
            >
              <Quote />
            </SvgIcon>
          </Box>
          <Box color="secondary.dark">
            <Typography variant="h5">{testimonial}</Typography>
          </Box>
        </CardContent>
        <CardHeader
          className={classes.cardHeader}
          title={name}
          subheader={job}
        ></CardHeader>
      </Card>
    </Box>
  );
};

Testimonial.propTypes = {
  testimonial: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  job: PropTypes.string.isRequired,
};

// Tutorial steps
const useStylesTutorial = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.root,
  },
}));

function getSteps(user) {
  return user === "student"
    ? ["Create an account", "Make a request", "Wait to be funded", "Pay back"]
    : ["2", "3", "4"];
}

function getStepContent(stepIndex, user) {
  const steps = {
    student: [
      "Create an account to fund your studies and achieve your dreams!",
      "Make a request so other people can help you get the financing you need!",
      "Wait to be funded because not everyone can finance your request and other students can be in the same situation as you!",
      "Pay back the money you received through planned payments only when you have the financial means to do so!",
    ],
    investor: ["ola2", "asd", "asdasd"],
  };

  return steps[user][stepIndex];
}

const Tutorial = () => {
  const classes = useStylesTutorial();
  const [activeStep, setActiveStep] = useState(0);
  const [user, setUser] = useState(null);
  const steps = getSteps(user);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setUser(null);
  };

  return user ? (
    <>
      <Stepper
        activeStep={activeStep}
        alternativeLabel
        className={classes.root}
      >
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Box display="flex" justifyContent="center">
        {activeStep === steps.length ? (
          <Box pt={3}>
            <Typography align="center">
              You&apos;re now ready to start using our application. Good luck!
            </Typography>
            <Box display="flex" justifyContent="center" pt={3}>
              <Button
                color="secondary"
                variant="outlined"
                onClick={handleReset}
              >
                Reset
              </Button>
            </Box>
          </Box>
        ) : (
          <Box pt={3}>
            <Typography align="center">
              {getStepContent(activeStep, user)}
            </Typography>
            <Box display="flex" justifyContent="center" pt={3}>
              <Button
                color="secondary"
                variant="outlined"
                disabled={activeStep === 0}
                onClick={handleBack}
              >
                Back
              </Button>
              <Button variant="contained" color="primary" onClick={handleNext}>
                {activeStep === steps.length - 1 ? "Finish" : "Next"}
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </>
  ) : (
    <Box display="flex" justifyContent="center">
      <Button
        variant="contained"
        color="secondary"
        onClick={() => setUser("student")}
      >
        I&apos;m a student
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setUser("investor")}
      >
        I&apos;m an investor
      </Button>
    </Box>
  );
};

const Panel = ({ background, title, subtitle, color, children }) => {
  return (
    <Box bgcolor={background} p={10}>
      <Typography variant="h2" align="center">
        <Box color={color}>{title}</Box>
      </Typography>
      <Typography variant="h5" color="textSecondary" align="center">
        <Box mb={5}>{subtitle}</Box>
      </Typography>
      {children}
    </Box>
  );
};

Panel.propTypes = {
  background: PropTypes.string,
  title: PropTypes.string.isRequired,
  color: PropTypes.string,
  subtitle: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

const Landing = () => {
  const classes = useStyles();

  return (
    <Box style={{ overflowX: "hidden" }}>
      <Box
        bgcolor="primary.main"
        className={classes.main}
        display="flex"
        alignItems="center"
      >
        <Grid container alignItems="center">
          <Grid xs={12} md={7} item>
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
            >
              <Typography variant="h1">
                <Box color="secondary.dark">TUICHAIN</Box>
              </Typography>
              <Typography variant="h5">
                <Box
                  color="secondary.contrastText"
                  textAlign="center"
                  style={{ padding: "0 14%" }}
                >
                  lorem lorem lorem lorem lorem asdf asd fasd fsasdfasdfasfdas
                  fdsa asdfasdfasdfas df asdfasdfa sdf asdf
                </Box>
              </Typography>
            </Box>
          </Grid>
          <Hidden smDown>
            <Grid md={5} item>
              <Typography variant="h1">
                <Box
                  color="secondary.dark"
                  display="flex"
                  justifyContent="flex-end"
                >
                  <img
                    src={logo}
                    className={classes.img}
                    // style={{ width: "70%", marginRight: "-20%" }}
                  />
                </Box>
              </Typography>
            </Grid>
          </Hidden>
        </Grid>
      </Box>

      <Panel title="Some text" color="secondary.dark">
        <Box className={classes.features}>
          <Grid container spacing={2} justify="center" alignContent="center">
            <Grid xs={12} sm={6} md={3} item>
              <Feature
                viewBox="0 0 640 512"
                icon={Handshake}
                name="Get an ISA"
                desc="Study first. Pay later. No tuition until you are hired."
              />
            </Grid>
            <Grid xs={12} sm={6} md={3} item>
              <Feature
                viewBox="0 0 320 512"
                icon={Ethereum}
                name="Crypto friendly"
                desc="Invest your idle assets in supporting good cause"
              />
            </Grid>
            <Grid xs={12} sm={6} md={3} item>
              <Feature
                viewBox="0 0 640 512"
                icon={Infinity}
                name="Unlimited Funding"
                desc="There is no cap to the amount of money you can ask for, even if your dream course is very expensive!"
              />
            </Grid>
            <Grid xs={12} sm={6} md={3} item>
              <Feature
                viewBox="0 0 640 512"
                icon={PeopleCarry}
                name="Help Others"
                desc="After paying your ISA, you can help others achieve their dream job with a few benefits!"
              />
            </Grid>
          </Grid>
        </Box>
      </Panel>

      <Panel
        background="secondary.main"
        title="Bring Education to the World"
        subtitle="Connecting and helping people all over the world"
        color="secondary.contrastText"
      >
        <img src={world} alt="Logo" />
      </Panel>

      <Panel
        title="How it works?"
        subtitle="Choose your use case and see how simple it is to start"
        color="secondary.dark"
      >
        <Tutorial />
      </Panel>

      <Panel
        title="Our Testimonials"
        subtitle="What our users think about us"
        color="secondary.contrastText"
        background="secondary.main"
      >
        <Carousel animation="slide">
          <Testimonial key={1} testimonial="Teste" name="teste" job="teste" />
          <Testimonial
            key={2}
            testimonial="Teste 2"
            name="Joni Silva"
            job="teste 2"
          />
        </Carousel>
      </Panel>
    </Box>
  );
};

export default Landing;
