import React from "react";
import PropTypes from "prop-types";
import { styled } from "@material-ui/styles";
import Box from "@material-ui/core/Box";
import theme from "./../theme";

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

const Layout = ({ children }) => (
  <Content>
    <Inside>{children}</Inside>
  </Content>
);

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
