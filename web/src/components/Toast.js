import React from "react";
import PropTypes from "prop-types";
import { Snackbar } from "@material-ui/core";
import { Alert } from "@material-ui/lab";

const Toast = (props) => {
  return (
    <Snackbar autoHideDuration={5000} {...props}>
      <Alert {...props} variant="filled">
        {props.children}
      </Alert>
    </Snackbar>
  );
};

Toast.defaultProps = {
  severity: "success",
};

Toast.propTypes = {
  children: PropTypes.string,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  severity: PropTypes.string, // TODO CHECK DEFAULT
};

export default Toast;
