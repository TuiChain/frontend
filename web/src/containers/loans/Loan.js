import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import ProgressBar from "../../components/Progress";
import LoansService from "../../services/loans.service";
import UserService from "../../services/user.service";
import LoansTransactionsService from "../../services/loans-transactions.service";
import InvestmentsService from "../../services/investment.service";
import { Create, School, Room } from "@material-ui/icons";
import DAI from "../../components/DAI";
import Toast from "../../components/Toast";
import {
  Typography,
  TextField,
  Button,
  ButtonGroup,
  Grid,
  Box,
  useMediaQuery,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import walletService from "../../services/wallet.service";
import LoadingPageAnimation from "../../components/LoadingPageAnimation";

function Student(props) {
  const [loan, setLoan] = useState({});
  const [user, setUser] = useState({});
  const [percentage, setPercentage] = useState(0);
  const [tokens, setTokens] = useState(0);
  const [investment, setInvestment] = useState(0);
  const [fetching, setFetching] = useState(true);
  const [toast, setToast] = React.useState({});
  const [open, setOpen] = React.useState(false);

  useEffect(async () => {
    const loan = await LoansService.getLoan(props.match.params.id);
    setLoan(loan);
    console.log("loan:", loan);

    let percentage =
      (loan.funded_value_atto_dai / loan.requested_value_atto_dai) * 100;
    percentage = percentage > 0 && percentage < 1 ? 1 : Math.floor(percentage);
    setPercentage(percentage);
    console.log("percentage:", percentage);

    const Info = await UserService.getUserInfo(loan.student);
    setUser(Info.user);
    console.log("user:", Info.user);

    const account = walletService.checkAccount();
    if (loan && loan.state.toUpperCase() == "FUNDING" && account != null) {
      const investment = await InvestmentsService.getInvestmentInLoan(
        loan.id,
        account
      );
      setInvestment(investment.nrTokens);
      console.log("investment:", investment);
    }

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

  const handleBuyClick = async () => {
    try {
      await LoansTransactionsService.provideFunds(
        props.match.params.id,
        tokens
      );

      await walletService.suggestStudentToken(loan.token_address);
    } catch (e) {
      buttonErrorTreatment(e);
    }
  };

  const handleWithdrawClick = async () => {
    try {
      await LoansTransactionsService.withdrawFunds(
        props.match.params.id,
        tokens
      );
    } catch (e) {
      buttonErrorTreatment(e);
    }
  };

  const buttonErrorTreatment = (e) => {
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
    }
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  /* -------------------------------------------------------------------------- */

  const message = (message) => (
    <Box>
      <Typography variant="h4">{message}</Typography>
    </Box>
  );

  const pending = message("Request waiting for approval");

  const rejected = message(
    "This loan request was rejected by Tuichain Administration"
  );

  const withdrawn = message("This loan request was rejected by the student");

  const funding = (
    <Box className="left-tok" width="fit-content" mx="auto">
      <Box py="10%">
        <Typography variant="h3">{"Tokens"}</Typography>
      </Box>
      <Box className="token">
        <TextField
          type={"number"}
          label="Tokens"
          name="tokens"
          variant="outlined"
          InputProps={{ inputProps: { min: 1 } }}
          onChange={(e) => {
            e.target.value = !Number.isInteger(e.target.value)
              ? Math.floor(e.target.value)
              : e.target.value;
            setTokens(e.target.value);
          }}
        />
        <ButtonGroup
          disableElevation
          variant="contained"
          color="primary"
          style={{ padding: "8px" }}
        >
          <Button
            type="submit"
            disabled={tokens == 0}
            onClick={handleBuyClick}
            style={{ margin: 0 }}
          >
            Buy
          </Button>
          <Button
            type="submit"
            disabled={investment == 0}
            onClick={handleWithdrawClick}
            style={{ margin: 0 }}
          >
            Withdraw
          </Button>
        </ButtonGroup>
      </Box>
      {investment > 0 && (
        <Box paddingTop="5%">
          <Typography variant="body1" display="inline">
            You&apos;ve already bought {investment} tokens!!
          </Typography>
        </Box>
      )}
      <Box className="barra" paddingTop="5%">
        <ProgressBar completed={percentage} />
      </Box>
    </Box>
  );

  const active = message("This loan is active");
  // show docs and stuff

  const finalized = message("This loan is active");
  // redeem token

  const expired = message("This loan has expired");
  // withdraw funds

  const canceled = message("This loan is canceled");
  // withdraw funds

  /* -------------------------------------------------------------------------- */

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
              <Box>
                <img src={user.profile_image} />
              </Box>
            </Grid>
            <Grid className="right-cont" item xs={12} md={6}>
              <Box className="right">
                <Box2 alignItems="baseline" className="header">
                  <Typography variant="h2" display="inline">
                    {user.username}
                  </Typography>
                </Box2>
                <Box2 className="up">
                  <Box className="par-init" display="flex">
                    <School />
                    <Typography variant="body1" display="inline">
                      {loan.school}
                    </Typography>
                  </Box>
                  <Box className="par" display="flex" paddingLeft="5%">
                    <Create />
                    <Typography variant="body1">{loan.course}</Typography>
                  </Box>
                </Box2>
                <Box2 className="down">
                  <Box className="par" display="flex">
                    <Room />
                    <Typography variant="body1" display="inline">
                      {loan.destination}
                    </Typography>
                  </Box>
                  <Box className="par" display="flex" paddingLeft="5%">
                    <DAI />
                    <Typography variant="body1" display="inline">
                      {loan.requested_value_atto_dai / Math.pow(10, 18)}
                    </Typography>
                  </Box>
                </Box2>
              </Box>
              <BoxDescr className="description">
                <Typography variant="body1" display="inline">
                  {loan.description}
                </Typography>
              </BoxDescr>
            </Grid>
            <Grid container spacing={2} className="container">
              <Grid item xs={12} md={6}>
                {loan.state.toUpperCase() == "PENDING" && pending}
                {loan.state.toUpperCase() == "REJECTED" && rejected}
                {loan.state.toUpperCase() == "WITHDRAWN" && withdrawn}
                {loan.state.toUpperCase() == "FUNDING" && funding}
                {loan.state.toUpperCase() == "ACTIVE" && active}
                {loan.state.toUpperCase() == "FINALIZED" && finalized}
                {loan.state.toUpperCase() == "EXPIRED" && expired}
                {loan.state.toUpperCase() == "CANCELED" && canceled}
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
