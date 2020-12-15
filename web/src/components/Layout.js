import React from "react";
import PropTypes from "prop-types";
import { styled } from "@material-ui/styles";
import Box from "@material-ui/core/Box";
// import theme from "./../theme";

// const MinimumHeightPageBox = styled(Box)({
//   padding: "20px 0 84px 0",
//   minHeight: "calc(100vh - 104px)",
//   margin: "0 auto -64px",
//   backgroundColor: theme.palette.secondary.light,
// });

const Content = styled(Box)({
  minHeight: "calc(100vh - 128px)",
  backgroundColor: "white",
});

const Inside = styled(Box)({
  paddingBottom: "50px",
});

const Layout = ({ children }) => (
  <Content>
    <Inside>{children}</Inside>
  </Content>
  //   <MinimumHeightPageBox>{children}</MinimumHeightPageBox>
);

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
