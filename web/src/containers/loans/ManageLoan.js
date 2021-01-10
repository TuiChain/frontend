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
import LoanRequestService from "../../services/loanrequest.service";
import { Euro, Create, School, Room, CloudUpload } from "@material-ui/icons";
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

const Status = ({ statusID }) => {
  const matchStatus = (id) => {
    switch (id) {
      case 0:
        return ["Funding", "#F5B300"];
      case 1:
        return ["Expired", "#ED2E50"];
      case 2:
        return ["Canceled", "#ED2E50"];
      case 3:
        return ["Active", "#58C400"];
      case 4:
        return ["Finalized", "#293A41"];
      case 5:
        return ["Requested", "#109D96"];
      case 6:
        return ["Rejected", "#ED2E50"];
      default:
        return ["", "#109D96"];
    }
  };

  const [status, color] = matchStatus(statusID);

  return (
    <Chip label={status} style={{ backgroundColor: color, color: "white" }} />
  );
};

Status.propTypes = {
  statusID: PropTypes.number,
};

const ManageLoan = (props) => {
  const loanID = props.match.params.id;
  const [loan, setLoan] = useState({});

  useEffect(() => {
    async function fetchLoan() {
      const data = await LoanRequestService.getLoan(loanID);
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
        <Status statusID={loan.status} />
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
            <Euro color="secondary" />
            <span style={{ paddingLeft: 10 }}>
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
