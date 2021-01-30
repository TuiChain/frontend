import React from "react";
import PropTypes from "prop-types";
import { Chip } from "@material-ui/core";
import theme from "./../theme";

const Status = ({ state, size }) => {
  const matchState = (state) => {
    switch (state?.toUpperCase()) {
      case "FUNDING":
        return theme.palette.phase.funding;
      case "EXPIRED":
        return theme.palette.phase.expired;
      case "CANCELED":
        return theme.palette.phase.canceled;
      case "WITHDRAWN":
        return theme.palette.phase.withdrawn;
      case "ACTIVE":
        return theme.palette.phase.active;
      case "FINALIZED":
        return theme.palette.phase.finalized;
      case "PENDING":
        return theme.palette.phase.pending;
      case "REJECTED":
        return theme.palette.phase.rejected;
      default:
        return theme.palette.primary.main;
    }
  };

  const color = matchState(state);

  return (
    <Chip
      label={state}
      size={size}
      style={{ backgroundColor: color, color: "white" }}
    />
  );
};

Status.defaultProps = {
  size: "medium",
};

Status.propTypes = {
  state: PropTypes.string,
  size: PropTypes.string,
};

export default Status;
