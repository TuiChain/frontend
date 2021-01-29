import React from "react";
import PropTypes from "prop-types";
import { styled } from "@material-ui/styles";
import Box from "@material-ui/core/Box";
import theme from "./../theme";
import { withRouter } from "react-router";
import Header from "./Header";

const Content = styled(Box)({
  minHeight: "calc(100vh - 112px)",
  backgroundColor: theme.palette.background.root,
  "@media (min-width: 600px)": {
    minHeight: "calc(100vh - 128px)",
  },
});

const Inside = styled(Box)({
  padding: "20px 15% 50px 15%",
  "@media (max-width: 600px)": {
    padding: "20px 5% 50px 5%",
  },
});


const Layout = ({ children, match, auth, onLogout, wallet }) => {
  const is_home_page = match.isExact; // "/" is the only exact path

  return is_home_page ? (
    <>
      <Header auth={auth} onLogout={onLogout} wallet={wallet} landing />
      <Content>{children}</Content>
    </>
  ) : (
    <>
      <Header auth={auth} onLogout={onLogout} wallet={wallet} />
      <Content>
        <Inside>{children}</Inside>
      </Content>
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  match: PropTypes.shape({
    isExact: PropTypes.bool,
  }),
  auth: PropTypes.oneOfType([
    PropTypes.object, // user token & type
    PropTypes.bool, // no auth token (false)
  ]),
  onLogout: PropTypes.func,
  wallet: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number, // 0 - uninstalled
  ]),
};

export default withRouter(Layout);
