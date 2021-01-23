import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRouter";
import Header from "./components/Header";
import Dashboard from "./containers/Dashboard";
import Login from "./containers/authentication/Login";
import Signup from "./containers/authentication/Signup";
import Loan from "./containers/loans/Loan";
import Loans from "./containers/loans/Loans";
import LoanRequest from "./containers/LoanRequest";
import LoanRequests from "./containers/admin/LoanRequests";
import Error from "./containers/Error";
import { ThemeProvider, withStyles } from "@material-ui/core/styles";
import theme from "./theme";
import AuthService from "./services/auth.service";
import WalletService from "./services/wallet.service";
import Layout from "./components/Layout";
import Footer from "./components/Footer";
import Landing from "./containers/Landing";
import ManageLoan from "./containers/loans/ManageLoan";
import Investments from "./containers/Investments";
import PersonalLoans from "./containers/loans/PersonalLoans";

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

  const [wallet, setWallet] = useState(WalletService.checkAccount);
  useEffect(async () => {
    await WalletService.changeAccounts(setWallet);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      {!loading && (
        <div className={classes.back}>
          <BrowserRouter>
            <Header auth={auth} onLogout={handlerLogout} wallet={wallet} />
            <Layout auth={auth}>
              <Switch>
                <Route exact path="/">
                  {auth && auth.is_admin ? (
                    <Redirect to="/admin/requests" />
                  ) : (
                    <Landing />
                  )}
                </Route>
                <ProtectedRoute
                  auth={auth}
                  path="/dashboard"
                  component={Dashboard}
                />
                <ProtectedRoute
                  auth={auth}
                  path="/loans/:id"
                  component={Loan}
                />
                <Route path="/loans" component={Loans} />
                <ProtectedRoute
                  auth={auth}
                  path="/personal/loans/:id"
                  component={ManageLoan}
                />
                <ProtectedRoute
                  auth={auth}
                  path="/personal/loans"
                  component={PersonalLoans}
                />
                <ProtectedRoute
                  auth={auth}
                  path="/request"
                  component={LoanRequest}
                  wallet={wallet}
                />
                <ProtectedRoute
                  auth={auth}
                  path="/investments"
                  component={Investments}
                  wallet={wallet}
                />
                <Route path="/login">
                  {auth ? (
                    auth.is_admin ? (
                      <Redirect to="/admin/requests" />
                    ) : (
                      <Redirect to="/dashboard" />
                    )
                  ) : (
                    <Login onLogin={handlerLogin} />
                  )}
                </Route>
                <Route path="/signup">
                  {auth ? (
                    auth.is_admin ? (
                      <Redirect to="/admin/requests" />
                    ) : (
                      <Redirect to="/dashboard" />
                    )
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
