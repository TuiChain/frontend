import React from "react";
import PropTypes from "prop-types";
import { SvgIcon } from "@material-ui/core";
import { ReactComponent as LogoIcon } from "../assets/icons/logo.svg";

const Logo = ({ size }) => {
  return (
    <SvgIcon style={{ fontSize: size }} viewBox="0 0 1194 1194">
      <LogoIcon />
    </SvgIcon>
  );
};

Logo.defaultProps = {
  size: 40,
};

Logo.propTypes = {
  size: PropTypes.number,
};

export default Logo;
