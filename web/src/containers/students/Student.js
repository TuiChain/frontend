import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import ProgressBar from "../../components/Progress";
import LoansService from "../../services/loans.service";
import UserService from "../../services/user.service";
import LoansTransactionsService from "../../services/loans-transactions.service";
import { Create, School, Room } from "@material-ui/icons";
import DAI from "../../components/DAI";
import Toast from "../../components/Toast";
import {
  Typography,
  TextField,
  Button,
  Grid,
  Box,
  useMediaQuery,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import walletService from "../../services/wallet.service";
import LoadingPageAnimation from "../../components/LoadingPageAnimation";

function Student(props) {
  const [user, setUser] = useState({});
  const [userInfo, setUserInfo] = useState({});
  const [percentage, setPercentage] = useState(0);
  const [tokens, setTokens] = useState(0);
  const [fetching, setFetching] = useState(true);
  const [toast, setToast] = React.useState({});
  const [open, setOpen] = React.useState(false);

  useEffect(async () => {
    const temp = await LoansService.getLoan(props.match.params.id);
    setUser(temp);
    console.log(temp);
    setPercentage(
      (temp.funded_value_atto_dai / temp.requested_value_atto_dai) * 100
    );
    console.log(percentage);
    const Info = await UserService.getUserInfo(temp.student);
    setUserInfo(Info.user);
    console.log(Info.user);
    setFetching(false);
  }, []);

  const matches = useMediaQuery("(min-width:600px)");

  const Box2 = withStyles({
    root: {
      justifyContent: matches === false ? "center" : "inherit",
      display: "flex",
      paddingBottom: "5%",
    },
  })(Box);

  const BoxDescr = withStyles({
    root: {
      paddingLeft: matches === false ? "12%" : "inherit",
      paddingRight: matches === false ? "12%" : "inherit",
      paddingBottom: matches === false ? "10%" : "inherit",
    },
  })(Box);

  const handleButtonClick = async () => {
    try {
      await LoansTransactionsService.provideFunds(
        props.match.params.id,
        tokens
      );

      await walletService.suggestStudentToken(user.token_address);
    } catch (e) {
      switch (e.message) {
        case "Invalid parameters: must provide an Ethereum address.":
          setToast({
            message: "Your account is not connected!",
            severity: "error",
          });
          setOpen(true);
          break;

        case "Incorrect chain ID":
          setToast({
            message: "You're not in the correct network!",
            severity: "error",
          });
          setOpen(true);
          break;

        default:
          break;
      }
    }
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };
  const style = {
    display: "block",
    margin: "auto",
    height: "100%",
    width: "100%",
  };
  return (
    <>
      {fetching ? (
        <Box style={{ height: "calc(100vh - 128px)" }}>
          <LoadingPageAnimation />
        </Box>
      ) : (
        <Box className="student" component="span" m={1}>
          <Grid container spacing={2} className="container">
            <Grid className="left-cont" item xs={12} md={6}>
              {matches === true && (
                <Box>
                  <img
                    height="300px"
                    width="300px"
                    src={userInfo.profile_pic}
                  />
                </Box>
              )}
              {matches === false && (
                <Box>
                  <img style={style} src={userInfo.profile_pic} />
                </Box>
              )}
            </Grid>
            <Grid className="right-cont" item xs={12} md={6}>
              <Box className="right">
                <Box2 alignItems="baseline" className="header">
                  <Typography variant="h2" display="inline">
                    {userInfo.username}
                  </Typography>
                </Box2>
                <Box2 className="up">
                  <Box className="par-init" display="flex">
                    <School />
                    <Typography variant="body1" display="inline">
                      {user.school}
                    </Typography>
                  </Box>
                  <Box className="par" display="flex" paddingLeft="5%">
                    <Create />
                    <Typography variant="body1">{user.course}</Typography>
                  </Box>
                </Box2>
                <Box2 className="down">
                  <Box className="par" display="flex">
                    <Room />
                    <Typography variant="body1" display="inline">
                      {user.destination}
                    </Typography>
                  </Box>
                  <Box className="par" display="flex" paddingLeft="5%">
                    <DAI />
                    <Typography variant="body1" display="inline">
                      {user.requested_value_atto_dai / Math.pow(10, 18)}
                    </Typography>
                  </Box>
                </Box2>
              </Box>
              <BoxDescr className="description">
                <Typography variant="body1" display="inline">
                  {user.description}
                </Typography>
              </BoxDescr>
            </Grid>
            <Grid container spacing={2} className="container">
              <Grid item xs={12} md={6}>
                {user.state === "PENDING" && (
                  <Box paddingTop="6%">
                    <Typography variant="h3">
                      Request waiting for approval
                    </Typography>
                  </Box>
                )}
                {user.state != "PENDING" && (
                  <Box
                    className="left-tok"
                    width="fit-content"
                    marginLeft="auto"
                    marginRight="auto"
                  >
                    <Box pt="10%" marginBottom="10%">
                      <Typography variant="h3">{"Tokens"}</Typography>
                    </Box>
                    <Box className="token">
                      <TextField
                        type={"number"}
                        label="Tokens"
                        name="tokens"
                        variant="outlined"
                        InputProps={{ inputProps: { min: 0 } }}
                        onChange={(e) => {
                          e.target.value = !Number.isInteger(e.target.value)
                            ? Math.floor(e.target.value)
                            : e.target.value;
                          setTokens(e.target.value);
                        }}
                      />
                      <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        onClick={handleButtonClick}
                      >
                        Buy
                      </Button>
                    </Box>
                    <Box className="barra" paddingTop="5%">
                      <ProgressBar completed={percentage} />
                    </Box>
                  </Box>
                )}
              </Grid>
            </Grid>
          </Grid>
          <Toast open={open} onClose={handleClose} severity={toast.severity}>
            {toast.message}
          </Toast>
        </Box>
      )}
    </>
  );
}

Student.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }),
  }),
};

export default Student;
