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

  console.log("loan", loan);
  return (
    <>
      <Box display="flex" alignItems="center">
        <Typography variant="h3">Loan #{loan.id}</Typography>
        <Chip label="Status" />
      </Box>
      <hr />
      <Box>
        <Typography variant="h5">Loan info</Typography>
        <Typography variant="body1" color="textSecondary" paragraph>
          Information about the state of your loan.
        </Typography>
        <Box display="flex" justifyContent="center">
          <CenteredTypography variant="body1">
            <Euro />
            <span style={{ paddingLeft: 10 }}>
              {loan.current_amount}/{loan.amount}
            </span>
          </CenteredTypography>
          <CenteredTypography variant="body1">
            <School />
            <span style={{ paddingLeft: 10 }}>{loan.school}</span>
          </CenteredTypography>
          <CenteredTypography variant="body1">
            <Create />
            <span style={{ paddingLeft: 10 }}>{loan.course}</span>
          </CenteredTypography>
          <CenteredTypography variant="body1">
            <Room />
            <span style={{ paddingLeft: 10 }}>TODO</span>
          </CenteredTypography>
        </Box>
        <Box>
          <Typography variant="body1" paragraph>
            {loan.description}
          </Typography>
        </Box>
      </Box>
      <hr />
      <Box>
        <Typography variant="h5">Documents</Typography>
        <Typography variant="body1" color="textSecondary" paragraph>
          Submit documents relative to your academic achievements, income, etc.
        </Typography>
        <TextField type="file" variant="outlined" />
        <Button
          variant="contained"
          color="secondary"
          startIcon={<CloudUpload />}
        >
          Upload
        </Button>
      </Box>
      <hr />
      <Box>
        <Typography variant="h5">Cancel</Typography>
        <Typography variant="body1" color="textSecondary" paragraph>
          To cancel your loan, press the button below. WARNING: you can&apos;t
          go back!
        </Typography>
        <ErrorButton variant="contained">Cancel</ErrorButton>
      </Box>
    </>
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
