/* eslint-disable react/prop-types */
import { React, Component } from "react";
import { Route, Redirect } from "react-router-dom";

class ProtectedRoute extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authenticated: false,
    };
  }

  render() {
    const { component: Component, ...props } = this.props;

    return (
      <Route
        {...props}
        render={(props) =>
          this.state.authenticated ? (
            <Component {...props} />
          ) : (
            <Redirect to="/login" />
          )
        }
      />
    );
  }
}

export default ProtectedRoute;
