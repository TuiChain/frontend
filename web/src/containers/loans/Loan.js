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
          <List component="nav">
            {documents.map((d, index) => (
              <Link href={d.url} target="_blank" key={index} underline="none">
                <ListItem button>
                  <ListItemText primary={d.name} />
                </ListItem>
              </Link>
            ))}
          </List>
        </Card>
      </Box>
    </Box>
  );
};

function Loan(props) {
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

    let percentage = (loan.funded_value / loan.requested_value) * 100;
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

  const style = {
    display: "block",
    margin: "auto",
    height: "100%",
    width: "100%",
  };

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
      <Box paddingTop="5%">
        <ProgressBar completed={percentage} />
      </Box>
    </Box>
  );

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
        <Box m={1}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
            {matches === true && (
                <Box>
                  <img
                    height="300px"
                    width="300px"
                    src={user.profile_pic}
                  />
                </Box>
              )}
              {matches === false && (
                <Box>
                  <img style={style} src={user.profile_pic} />
                </Box>
              )}
            </Grid>
            <Grid item xs={12} md={6}>
              <Box>
                <Box2 alignItems="baseline">
                  <Typography variant="h2" display="inline">
                    {user.full_name}
                  </Typography>
                </Box2>
                <Box2>
                  <Box display="flex">
                    <School />
                    <Typography variant="body1" display="inline">
                      {loan.school}
                    </Typography>
                  </Box>
                  <Box display="flex" paddingLeft="5%">
                    <Create />
                    <Typography variant="body1">{loan.course}</Typography>
                  </Box>
                </Box2>
                <Box2>
                  <Box display="flex">
                    <Room />
                    <Typography variant="body1" display="inline">
                      {loan.destination}
                    </Typography>
                  </Box>
                  <Box display="flex" paddingLeft="5%">
                    <DAI />
                    <Typography variant="body1" display="inline">
                      {loan.requested_value_atto_dai / Math.pow(10, 18)}
                    </Typography>
                  </Box>
                </Box2>
              </Box>
              <BoxDescr>
                <Typography variant="body1" display="inline">
                  {loan.description}
                </Typography>
              </BoxDescr>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            {loan.state.toUpperCase() == "PENDING" && pending}
            {loan.state.toUpperCase() == "REJECTED" && rejected}
            {loan.state.toUpperCase() == "WITHDRAWN" && withdrawn}
            {loan.state.toUpperCase() == "FUNDING" && funding}
            {loan.state.toUpperCase() == "ACTIVE" && <LoanActive loan={loan} />}
            {loan.state.toUpperCase() == "FINALIZED" && finalized}
            {loan.state.toUpperCase() == "EXPIRED" && expired}
            {loan.state.toUpperCase() == "CANCELED" && canceled}
          </Grid>
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
