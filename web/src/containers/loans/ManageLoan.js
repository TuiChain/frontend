import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Button,
  TextField,
  Typography,
  withStyles,
  styled,
} from "@material-ui/core";
import LoansService from "../../services/loans.service";
import { Create, School, Room, CloudUpload, Today } from "@material-ui/icons";
import DAI from "../../components/DAI";
import ProgressBar from "../../components/Progress";
import Status from "../../components/Status";
import Toast from "../../components/Toast";
import { Redirect, useHistory } from "react-router";

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

const ManageLoan = (props) => {
  const loanID = props.match.params.id;
  const [loan, setLoan] = useState({});
  const [isLoading, setLoading] = useState(true);

  // Toast
  const [toast, setToast] = React.useState({});
  const [open, setOpen] = React.useState(false);
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const history = useHistory();

  useEffect(() => {
    async function fetchLoan() {
      const data = await LoansService.getLoan(loanID);
      setLoan(data);
      setLoading(false);
    }
    fetchLoan();
  }, []);

  const canCancel = (status) => {
    return ["FUNDING", "PENDING"].includes(status.toUpperCase());
  };

  const canSubmitDocuments = (status) => {
    return ["ACTIVE", "FINALIZED"].includes(status.toUpperCase());
  };

  const clickCancel = async (state, id) => {
    try {
      switch (state) {
        case "PENDING":
          await LoansService.withdrawLoanRequest(id);
          break;

        case "FUNDING":
          await LoansService.cancelLoan(id);
          break;
      }

      history.replace("/personal/loans");
    } catch (error) {
      setToast({
        message: error.response.data.error,
        severity: "error",
      });
      setOpen(true);
    }
  };

  return loan ? (
    !isLoading && (
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
                {loan.funded_value}/{loan.requested_value}
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
            <CenteredTypography variant="body1" color="secondary">
              <Today />
              <span style={{ paddingLeft: 10 }}>
                {loan.request_date.substring(0, 10)}
              </span>
            </CenteredTypography>
          </Box>
          <Box px={4} py={2}>
            <ProgressBar
              completed={(loan.funded_value * 100) / loan.requested_value}
            />
          </Box>
          <Box px={4}>
            <Typography variant="subtitle2" paragraph>
              Description
            </Typography>
            <Typography variant="body1" paragraph>
              {loan.description}
            </Typography>
          </Box>
        </Panel>
        <hr />
        <Panel>
          <Typography variant="h5" color="secondary">
            Documents
          </Typography>
          <Typography variant="body1" color="textSecondary" paragraph>
            Submit documents relative to your academic achievements, income,
            etc.
          </Typography>
          <TextField type="file" variant="outlined" />
          <Button
            variant="contained"
            color="secondary"
            startIcon={<CloudUpload />}
            disabled={!canSubmitDocuments(loan.state)}
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
          <ErrorButton
            variant="contained"
            disabled={!canCancel(loan.state)}
            onClick={() => clickCancel(loan.state, loan.id)}
          >
            Cancel
          </ErrorButton>
        </Panel>
        <Toast open={open} onClose={handleClose} severity={toast.severity}>
          {toast.message}
        </Toast>
      </>
    )
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
