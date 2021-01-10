import { React } from "react";
import PropTypes from "prop-types";
import { Route, Redirect } from "react-router-dom";

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const { auth, type } = rest;

  return type && type == "admin" ? (
    <Route
      {...rest}
      render={(props) =>
        auth && auth.is_admin ? (
          <Component {...rest} {...props} />
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  ) : (
    <Route
      {...rest}
      render={(props) =>
        auth && !auth.is_admin ? (
          <Component {...rest} {...props} />
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
};

ProtectedRoute.propTypes = {
  component: PropTypes.oneOfType([
    PropTypes.func, // normal func component
    PropTypes.object, // withStyles component
  ]),
};

export default ProtectedRoute;
