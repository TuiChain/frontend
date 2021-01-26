import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Typography, Box } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

const ProgressBar = ({ completed, visible, slim }) => {
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    const percentage =
      completed > 0 && completed < 1 ? 1 : Math.floor(completed);
    setPercentage(percentage);
  }, [completed]);

  const Box3 = withStyles({
    root: {
      height: slim ? 12 : 25,
      width: slim ? "90%" : "100%",
      backgroundColor: slim ? "#EFF0F6" : "#e0e0de",
      borderRadius: 50,
      marginTop: slim && "-6px!important",
      margin: slim && "auto",
    },
  })(Box);

  const Box2 = withStyles({
    root: {
      height: "100%",
      width: `${completed}%`,
      backgroundColor: "#3AAFA9",
      borderRadius: "inherit",
      textAlign: "center",
    },
  })(Box);

  const WhiteTextTypography = withStyles({
    root: {
      color: "#FFFFFF",
      display: visible === false ? "none" : "inline",
      textAlign: "center",
    },
  })(Typography);

  return (
    <Box3>
      <Box2>
        <Box marginLeft="5px">
          {slim || (
            <WhiteTextTypography color="inherit" variant="button">
              {`${percentage}%`}
            </WhiteTextTypography>
          )}
        </Box>
      </Box2>
    </Box3>
  );
};

ProgressBar.propTypes = {
  completed: PropTypes.number,
  visible: PropTypes.string,
  slim: PropTypes.bool,
};

export default ProgressBar;
