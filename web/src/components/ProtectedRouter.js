import { React } from "react";
import PropTypes from "prop-types";
import { Route, Redirect } from "react-router-dom";

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const { auth, type } = rest;
  console.log(auth);
  return type && type == "admin" ? (
    <Route
      {...rest}
      render={(props) =>
        auth && auth.isAdmin ? (
          <Component {...rest} {...props} />
        ) : (
          <Redirect to="/" />
        )
      }
    />
  ) : (
    <Route
      {...rest}
      render={(props) =>
        auth && !auth.isAdmin ? (
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
