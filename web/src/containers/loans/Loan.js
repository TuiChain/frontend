/* eslint react/prop-types: 0 */
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
  List,
  ListItem,
  ListItemText,
  Card,
  Link,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import walletService from "../../services/wallet.service";
import LoadingPageAnimation from "../../components/LoadingPageAnimation";
import documentsService from "../../services/documents.service";
import { Alert } from "@material-ui/lab";

const fetchInvestments = async (loan, setInvestment) => {
  const account = walletService.checkAccount();
  if (loan && account != null) {
    const investment = await InvestmentsService.getInvestmentInLoan(
      loan.id,
      account
    );
    setInvestment(investment.nrTokens);
  }
};

const buttonErrorTreatment = (e, setToast, setOpen) => {
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

const LoanFunding = ({ loan, setToast, setOpen, setLoan }) => {
  const [investment, setInvestment] = useState(0);
  const [tokens, setTokens] = useState(0);
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    const fetchInfo = async () => {
      const loaninfo = await LoansService.getLoan(loan.id);
      setLoan(loaninfo);
      const percentage =
        (loaninfo.funded_value / loaninfo.requested_value) * 100;
      setPercentage(percentage);

      fetchInvestments(loan, setInvestment);
    };

    fetchInfo();

    const timer = setInterval(() => {
      fetchInfo();
    }, 10000);

    return () => clearInterval(timer);
  }, []);

  const handleBuyClick = async () => {
    try {
      await LoansTransactionsService.provideFunds(loan.id, tokens);

      await walletService.suggestStudentToken(loan.token_address);
    } catch (e) {
      buttonErrorTreatment(e, setToast, setOpen);
    }
  };

  const handleWithdrawClick = async () => {
    try {
      await LoansTransactionsService.withdrawFunds(loan.id, tokens);
    } catch (e) {
      buttonErrorTreatment(e, setToast, setOpen);
    }
  };

  return (
    <Box width="fit-content">
      <Box py="10%">
        <Typography variant="h3">Tokens</Typography>
      </Box>
      <Box>
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
            disabled={investment == 0 || tokens == 0}
            onClick={handleWithdrawClick}
            style={{ margin: 0 }}
          >
            Withdraw
          </Button>
        </ButtonGroup>
      </Box>
      {tokens > 0 && (
        <Box paddingTop="5%">
          <Typography variant="body1" display="inline">
            Buying {tokens} token{tokens > 1 && "s"}, will cost you{" "}
            {(tokens * (1 + loan.funding_fee)).toFixed(2)} <DAI /> !
          </Typography>
        </Box>
      )}
      {investment > 0 && (
        <Box paddingTop="5%">
          <Typography variant="body1" display="inline">
            You&apos;ve already bought {investment} tokens!
          </Typography>
        </Box>
      )}
      <Box paddingTop="5%">
        <ProgressBar completed={percentage} />
      </Box>
    </Box>
  );
};

const LoanActive = ({ loan }) => {
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    const fetchDocuments = async () => {
      const docs = await documentsService.getLoanPublicDocuments(loan.id);
      setDocuments(docs);
    };
    fetchDocuments();
  }, []);

  return (
    <Box width="100%">
      <Box py={2}>
        <Typography variant="h3">Documents</Typography>
        <Typography variant="subtitle1" color="textSecondary">
          Documents uploaded by the student
        </Typography>
      </Box>
      <Box>
        <Card style={{ width: "100%" }}>
          {documents.length ? (
            <List component="nav">
              {documents.map((d, index) => (
                <Link href={d.url} target="_blank" key={index} underline="none">
                  <ListItem button>
                    <ListItemText primary={d.name} />
                  </ListItem>
                </Link>
              ))}
            </List>
          ) : (
            <ListItem>
              <ListItemText primary="There are no documents uploaded." />
            </ListItem>
          )}
        </Card>
      </Box>
    </Box>
  );
};

const LoanCanceledExpired = ({ loan, setToast, setOpen, message }) => {
  const [investment, setInvestment] = useState(0);
  const [tokens, setTokens] = useState(0);

  useEffect(() => {
    fetchInvestments(loan, setInvestment);

    const timer = setInterval(() => {
      fetchInvestments(loan, setInvestment);
    }, 10000);

    return () => clearInterval(timer);
  }, []);

  const handleClick = async () => {
    try {
      await LoansTransactionsService.withdrawFunds(loan.id, tokens);
    } catch (e) {
      buttonErrorTreatment(e, setToast, setOpen);
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Alert severity="error">{message}</Alert>
      </Grid>
      {investment != 0 && (
        <Grid item xs={12} sm={6}>
          <Box display="flex">
            <TextField
              type={"number"}
              fullWidth
              label="Tokens"
              name="tokens"
              variant="outlined"
              InputProps={{ inputProps: { min: 1, max: investment } }}
              onChange={(e) => {
                e.target.value = !Number.isInteger(e.target.value)
                  ? Math.floor(e.target.value)
                  : e.target.value;
                setTokens(e.target.value);
              }}
            />
            <Button
              disableElevation
              variant="contained"
              color="primary"
              type="submit"
              disabled={tokens == 0}
              onClick={handleClick}
            >
              Withdraw
            </Button>
          </Box>
          <Box paddingTop="2%">
            <Typography variant="body1" display="inline">
              You still have {investment} tokens!
            </Typography>
          </Box>
        </Grid>
      )}
    </Grid>
  );
};

const LoanFinalized = ({ loan, setToast, setOpen, message }) => {
  const [investment, setInvestment] = useState(0);
  const [tokens, setTokens] = useState(0);

  useEffect(() => {
    fetchInvestments(loan, setInvestment);

    const timer = setInterval(() => {
      fetchInvestments(loan, setInvestment);
    }, 10000);

    return () => clearInterval(timer);
  }, []);

  const handleClick = async () => {
    try {
      await LoansTransactionsService.redeemTokens(loan.id, tokens);
    } catch (e) {
      buttonErrorTreatment(e, setToast, setOpen);
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Alert severity="info">{message}</Alert>
      </Grid>
      {investment != 0 && (
        <Grid item xs={12} sm={6}>
          <TextField
            type={"number"}
            label="Tokens"
            name="tokens"
            variant="outlined"
            InputProps={{ inputProps: { min: 1, max: investment } }}
            onChange={(e) => {
              e.target.value = !Number.isInteger(e.target.value)
                ? Math.floor(e.target.value)
                : e.target.value;
              setTokens(e.target.value);
            }}
          />
          <Button
            disableElevation
            variant="contained"
            color="primary"
            type="submit"
            disabled={tokens == 0}
            onClick={handleClick}
          >
            Redeem
          </Button>
          <Box paddingTop="5%">
            <Typography variant="body1" display="inline">
              You still got {investment} tokens to redeem!!
            </Typography>
          </Box>
        </Grid>
      )}
    </Grid>
  );
};

function Loan(props) {
  const [loan, setLoan] = useState({});
  const [user, setUser] = useState({});
  const [fetching, setFetching] = useState(true);
  const [toast, setToast] = React.useState({});
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    const fetchLoan = async () => {
      const loan = await LoansService.getLoan(props.match.params.id);
      setLoan(loan);
      console.log("loan:", loan);

      const Info = await UserService.getUserInfo(loan.student);
      setUser(Info.user);
      console.log("user:", Info.user);

      setFetching(false);
    };

    fetchLoan();
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
      paddingTop: "20px",
      paddingLeft: matches === false ? "12%" : "inherit",
      paddingRight: matches === false ? "12%" : "inherit",
      paddingBottom: matches === false ? "10%" : "inherit",
    },
  })(Box);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  /* -------------------------------------------------------------------------- */

  const message = (message) => (
    <Box width="100%">
      <Alert severity="error">{message}</Alert>
    </Box>
  );

  const pending = message("Request waiting for approval!");

  const rejected = message(
    "This loan request was rejected by Tuichain Administration!"
  );

  const withdrawn = message("This loan request was withdrawn by the student!");

  /* -------------------------------------------------------------------------- */
  return (
    <>
      {fetching ? (
        <Box style={{ height: "calc(100vh - 128px)" }}>
          <LoadingPageAnimation />
        </Box>
      ) : (
        <Box m={1}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              {matches === true ? (
                <Box display="flex" justifyContent="center">
                  <img height="300px" width="300px" src={user.profile_pic} />
                </Box>
              ) : (
                <Box>
                  <img
                    style={{
                      display: "block",
                      margin: "auto",
                      height: "100%",
                      width: "100%",
                    }}
                    src={user.profile_pic}
                  />
                </Box>
              )}
            </Grid>
            <Grid item xs={12} md={6}>
              <Box>
                <Box2 alignItems="baseline">
                  <Typography variant="h3" display="inline">
                    {user.full_name}
                  </Typography>
                </Box2>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Box
                      display="flex"
                      alignContent="center"
                      alignItems="center"
                    >
                      <School style={{ fontSize: 32 }} color="secondary" />
                      <Typography
                        variant="body1"
                        style={{ paddingLeft: "10px" }}
                      >
                        {loan.school}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box
                      display="flex"
                      alignContent="center"
                      alignItems="center"
                    >
                      <Create style={{ fontSize: 32 }} color="secondary" />
                      <Typography
                        variant="body1"
                        style={{ paddingLeft: "10px" }}
                      >
                        {loan.course}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box
                      display="flex"
                      alignContent="center"
                      alignItems="center"
                    >
                      <Room style={{ fontSize: 32 }} color="secondary" />
                      <Typography
                        variant="body1"
                        style={{ paddingLeft: "10px" }}
                      >
                        {loan.destination}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box
                      display="flex"
                      alignContent="center"
                      alignItems="center"
                    >
                      <DAI size={32} />
                      <Typography
                        variant="body1"
                        style={{ paddingLeft: "10px" }}
                      >
                        {loan.requested_value_atto_dai / Math.pow(10, 18)}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
              <BoxDescr>
                <Typography variant="body1">
                  <b>Description</b>
                </Typography>
                <Typography variant="body1" color="secondary">
                  {loan.description}
                </Typography>
              </BoxDescr>
            </Grid>
          </Grid>
          <Box pt={3}>
            {loan.state.toUpperCase() == "PENDING" && pending}
            {loan.state.toUpperCase() == "REJECTED" && rejected}
            {loan.state.toUpperCase() == "WITHDRAWN" && withdrawn}
            {loan.state.toUpperCase() == "FUNDING" && (
              <LoanFunding loan={loan} setToast={setToast} setOpen={setOpen} setLoan={setLoan} />
            )}
            {loan.state.toUpperCase() == "ACTIVE" && <LoanActive loan={loan} />}
            {loan.state.toUpperCase() == "FINALIZED" && (
              <LoanFinalized
                loan={loan}
                setToast={setToast}
                setOpen={setOpen}
                message="This loan is finalized!"
              />
            )}
            {loan.state.toUpperCase() == "EXPIRED" && (
              <LoanCanceledExpired
                loan={loan}
                setToast={setToast}
                setOpen={setOpen}
                message="This loan has expired!"
              />
            )}
            {loan.state.toUpperCase() == "CANCELED" && (
              <LoanCanceledExpired
                loan={loan}
                setToast={setToast}
                setOpen={setOpen}
                message={"This loan is canceled!"}
              />
            )}
          </Box>
          <Toast open={open} onClose={handleClose} severity={toast.severity}>
            {toast.message}
          </Toast>
        </Box>
      )}
    </>
  );
}

Loan.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }),
  }),
};

export default Loan;
