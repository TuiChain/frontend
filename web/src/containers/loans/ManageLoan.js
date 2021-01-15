import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Button,
  Chip,
  TextField,
  Typography,
  withStyles,
  styled,
} from "@material-ui/core";
import LoansService from "../../services/loans.service";
import { Create, School, Room, CloudUpload } from "@material-ui/icons";
import DAI from "../../components/DAI";
import { Redirect } from "react-router";

const ErrorButton = withStyles((theme) => ({
  root: {
    color: theme.palette.error.contrastText,
    backgroundColor: theme.palette.error.main,
    "&:hover": {
      backgroundColor: theme.palette.error.dark,
    },
  },
}))(Button);

const CenteredTypography = styled(Typography)({
  display: "flex",
  alignItems: "center",
  flexWrap: "wrap",
  padding: "0 20px 10px 20px",
});

const Panel = styled(Box)({
  padding: "15px 0",
});

const Status = ({ state }) => {
  const matchState = (state) => {
    switch (state) {
      case "Funding":
        return "#F5B300";
      case "Expired":
        return "#ED2E50";
      case "Canceled":
        return "#ED2E50";
      case "Active":
        return "#58C400";
      case "Finalized":
        return "#293A41";
      case "Requested":
        return "#109D96";
      case "Rejected":
        return "#ED2E50";
      default:
        return "#109D96";
    }
  };

  const color = matchState(state);

  return (
    <Chip label={state} style={{ backgroundColor: color, color: "white" }} />
  );
};

Status.propTypes = {
  state: PropTypes.string,
};

const ManageLoan = (props) => {
  const loanID = props.match.params.id;
  const [loan, setLoan] = useState({});

  useEffect(() => {
    async function fetchLoan() {
      const data = await LoansService.getLoan(loanID);
      setLoan(data);
    }
    fetchLoan();
  }, []);

  const canCancel = (status) => {
    return [0, 5].includes(status);
  };

  const canSubmitDocuments = (status) => {
    return [3, 4].includes(status);
  };

  return loan ? (
    <>
      <Box display="flex" alignItems="center">
        <Typography variant="h3">
          <Box color="secondary.dark">Loan #{loan.id}</Box>
        </Typography>
        <Status state={loan.state} />
      </Box>
      <hr />
      <Panel>
        <Typography variant="h5" color="secondary">
          Loan info
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph>
          Information about the state of your loan.
        </Typography>
        <Box display="flex" justifyContent="center">
          <CenteredTypography variant="body1" color="secondary">
            <DAI />
            <span style={{ paddingLeft: 20 }}>
              {loan.current_amount}/{loan.amount}
            </span>
          </CenteredTypography>
          <CenteredTypography variant="body1" color="secondary">
            <School color="secondary" />
            <span style={{ paddingLeft: 10 }}>{loan.school}</span>
          </CenteredTypography>
          <CenteredTypography variant="body1" color="secondary">
            <Create />
            <span style={{ paddingLeft: 10 }}>{loan.course}</span>
          </CenteredTypography>
          <CenteredTypography variant="body1" color="secondary">
            <Room />
            <span style={{ paddingLeft: 10 }}>{loan.destination}</span>
          </CenteredTypography>
        </Box>
        <Box>
          <Typography variant="body1" paragraph>
            Description: {loan.description}
          </Typography>
        </Box>
      </Panel>
      <hr />
      <Panel>
        <Typography variant="h5" color="secondary">
          Documents
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph>
          Submit documents relative to your academic achievements, income, etc.
        </Typography>
        <TextField type="file" variant="outlined" />
        <Button
          variant="contained"
          color="secondary"
          startIcon={<CloudUpload />}
          disabled={!canSubmitDocuments(loan.status)}
        >
          Upload
        </Button>
      </Panel>
      <hr />
      <Panel>
        <Typography variant="h5" color="secondary">
          Cancel
        </Typography>
        <Typography variant="body1" color="textSecondary">
          To cancel your loan, press the button below.
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph>
          WARNING: you can&apos;t go back!
        </Typography>
        <ErrorButton variant="contained" disabled={!canCancel(loan.status)}>
          Cancel
        </ErrorButton>
      </Panel>
    </>
  ) : (
    <Redirect to="/404" />
  );
};

ManageLoan.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }),
  }),
};

export default ManageLoan;
