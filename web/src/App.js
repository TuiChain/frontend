import React, { useState } from "react";
import PropTypes from "prop-types";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRouter";
import Header from "./components/Header";
import Home from "./containers/Home";
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
import ManageLoan from "./containers/loans/ManageLoan";
import Loans from "./containers/loans/Loans";

const styles = {
  back: {
    backgroundColor: theme.palette.background.root,
  },
};

const App = (props) => {
  const { classes } = props;
  const [auth, setAuth] = useState(AuthService.getCurrentUser());

  const handlerLogin = (token) => {
    setAuth(token);
  };

  const handlerLogout = () => {
    setAuth(AuthService.logout());
  };

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.back}>
        <BrowserRouter>
          <Header auth={auth} onLogout={handlerLogout} />
          <Layout>
            <Switch>
              <Route exact path="/" component={Home} />
              <ProtectedRoute
                auth={auth}
                path="/students/:id"
                component={Student}
              />
              <ProtectedRoute
                auth={auth}
                path="/personal/loans/:id"
                component={ManageLoan}
              />
              <ProtectedRoute
                auth={auth}
                path="/personal/loans"
                component={Loans}
              />
              <ProtectedRoute
                auth={auth}
                path="/request"
                component={LoanRequest}
              />
              <Route path="/login">
                {auth ? <Redirect to="/" /> : <Login onLogin={handlerLogin} />}
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
                path="/admin/requests"
                component={LoanRequests}
              />
              <Route component={Error} />
            </Switch>
          </Layout>
          <Footer />
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
};

App.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(styles)(App);
