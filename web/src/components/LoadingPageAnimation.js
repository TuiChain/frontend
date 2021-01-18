import React from "react";
import { styled, CircularProgress } from "@material-ui/core";

const CenterBox = styled("div")({
  display: "flex",
  height: "100%",
  justifyContent: "center",
  alignItems: "center",
});

const LoadingPageAnimation = () => {
  return (
    <CenterBox>
      <CircularProgress size="100px" />
    </CenterBox>
  );
};

export default LoadingPageAnimation;
