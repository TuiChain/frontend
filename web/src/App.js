import React, { useEffect, useState } from "react";
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
import Students from "./containers/students/Students";
import AuthService from "./services/auth.service";
import WalletService from "./services/wallet.service";
import Layout from "./components/Layout";
import Footer from "./components/Footer";
import ManageLoan from "./containers/loans/ManageLoan";
import Loans from "./containers/loans/Loans";
import Investments from "./containers/Investments"

const styles = {
  back: {
    backgroundColor: theme.palette.background.root,
  },
};

const App = (props) => {
  const { classes } = props;

  const [auth, setAuth] = useState(null);
  useEffect(() => {
    const fetchUser = async () => {
      setAuth(await AuthService.getCurrentUser());
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

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.back}>
        <BrowserRouter>
          <Header
            auth={auth}
            onLogout={handlerLogout}
            wallet={wallet}
            setWallet={setWallet}
          />
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
                wallet={wallet}
              />
              <ProtectedRoute
                auth={auth}
                path="/investments"
                component={Investments}
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
              <Route path="/students" component={Students} />
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
    </ThemeProvider>
  );
};

App.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(styles)(App);
