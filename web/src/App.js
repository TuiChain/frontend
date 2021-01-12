import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRouter";
import Header from "./components/Header";
import Dashboard from "./containers/Dashboard";
import Login from "./containers/authentication/Login";
import Signup from "./containers/authentication/Signup";
import Student from "./containers/students/Student";
import LoanRequest from "./containers/LoanRequest";
import LoanRequests from "./containers/admin/LoanRequests";
import Error from "./containers/Error";
import { ThemeProvider, withStyles } from "@material-ui/core/styles";
import theme from "./theme";
import AuthService from "./services/auth.service";
import Layout from "./components/Layout";
import Footer from "./components/Footer";
import Landing from "./containers/Landing";

const styles = {
  back: {
    backgroundColor: theme.palette.background.root,
  },
};

const App = (props) => {
  const { classes } = props;
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState(null);
  useEffect(() => {
    const fetchUser = async () => {
      setAuth(await AuthService.getCurrentUser());
      setLoading(false);
    };
    fetchUser();
  }, []);

  const handlerLogin = (user) => {
    setAuth(user);
  };

  const handlerLogout = () => {
    setAuth(AuthService.logout());
  };

  return (
    <ThemeProvider theme={theme}>
      {!loading && (
        <div className={classes.back}>
          <BrowserRouter>
            <Header auth={auth} onLogout={handlerLogout} />
            <Layout auth={auth}>
              <Switch>
                {!auth && <Route exact path="/" component={Landing} />}
                {auth && <Route exact path="/" component={Dashboard} />}
                <ProtectedRoute
                  auth={auth}
                  path="/students/:id"
                  component={Student}
                />
                <ProtectedRoute
                  auth={auth}
                  path="/request"
                  component={LoanRequest}
                />
                <Route path="/login">
                  {auth ? (
                    <Redirect to="/" />
                  ) : (
                    <Login onLogin={handlerLogin} />
                  )}
                </Route>
                <Route path="/signup">
                  {auth ? (
                    <Redirect to="/" />
                  ) : (
                    <Signup onSignUp={handlerLogin} />
                  )}
                </Route>
                {/* ADMIN ROUTES */}
                <ProtectedRoute
                  auth={auth}
                  type="admin"
                  path="/admin/requests"
                  component={LoanRequests}
                />
                <Route component={Error} />
              </Switch>
            </Layout>
            <Footer />
          </BrowserRouter>
        </div>
      )}
    </ThemeProvider>
  );
};

App.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(styles)(App);
