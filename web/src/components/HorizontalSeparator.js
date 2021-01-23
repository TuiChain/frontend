import React from "react";
import PropTypes from "prop-types";
import { Box } from "@material-ui/core";
import { styled } from "@material-ui/core/styles";

const Separator = styled(Box)(({ color }) => ({
  border: color ? `1px solid ${color}` : "1px solid rgba(0,0,0,0.75)",
}));

const HorizontalSeparator = ({ color }) => {
  return <Separator color={color} />;
};

HorizontalSeparator.propTypes = {
  color: PropTypes.string,
};

export default HorizontalSeparator;
