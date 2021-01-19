import React from "react";
import PropTypes from "prop-types";
import { SvgIcon } from "@material-ui/core";
import { ReactComponent as DAISolid } from "../assets/icons/dai-solid.svg";
import { ReactComponent as DAIOutlined } from "../assets/icons/dai-outlined.svg";

const DAI = ({ size, variant, color }) => {
  return variant === "outlined" ? (
    <SvgIcon color={color} style={{ fontSize: size }} viewBox="0 0 600 600">
      <DAIOutlined />
    </SvgIcon>
  ) : (
    <SvgIcon style={{ fontSize: size }} viewBox="0 0 600 600">
      <DAISolid />
    </SvgIcon>
  );
};

DAI.defaultProps = {
  color: "secondary",
  variant: "solid",
  size: 24,
};

DAI.propTypes = {
  size: PropTypes.number,
  variant: PropTypes.string,
  color: PropTypes.string,
};

export default DAI;
