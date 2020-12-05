import React from "react";
import "./App.css";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRouter/ProtectedRouter";
import Header from "./components/Header/Header";
import Home from "./containers/Home/Home";
import Login from "./containers/Login/Login";
import Signup from "./containers/Signup/Signup";
import Student from "./containers/Students/Student/Student";
import Error from "./containers/Error/Error";
import { ThemeProvider } from "@material-ui/core/styles";
import theme from "./theme";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      auth: false,
    };
  }

  render() {
    return (
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <div className="App">
            <Header />
            <Switch>
              <Route exact path="/" component={Home} />
              <ProtectedRoute path="/students/:id" component={Student} />
              <Route path="/login">
                {this.state.auth ? <Redirect to="/" /> : <Login />}
              </Route>
              <Route path="/signup">
                {this.state.auth ? <Redirect to="/" /> : <Signup />}
              </Route>
              <Route component={Error} />
            </Switch>
          </div>
        </BrowserRouter>
      </ThemeProvider>
    );
  }
}

export default App;
