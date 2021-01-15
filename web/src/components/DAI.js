import React from "react";
import PropTypes from "prop-types";
import { SvgIcon } from "@material-ui/core";
import { ReactComponent as DAIIcon } from "../assets/icons/dai.svg";

const DAI = ({ size }) => {
  return (
    <SvgIcon style={{ fontSize: size }} viewBox="0 0 600 600">
      <DAIIcon />
    </SvgIcon>
  );
};

DAI.defaultProps = {
  size: 24,
};

DAI.propTypes = {
  size: PropTypes.number,
};

export default DAI;
