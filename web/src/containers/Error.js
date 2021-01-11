import React from "react";
import PropTypes from "prop-types";
import { Box, Button, Typography, withStyles } from "@material-ui/core";

const styles = {
  box: {
    height: "50vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
};

const Error = ({ classes }) => {
  return (
    <Box className={classes.box}>
      <Typography variant="h1" color="secondary" paragraph>
        Ooops...
      </Typography>
      <Typography variant="h5" color="textSecondary" paragraph>
        Something went wrong, page not found...
      </Typography>
      <Button variant="contained" color="secondary" to="/">
        Take me to home
      </Button>
    </Box>
  );
};

Error.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(styles)(Error);
