import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Button,
  TextField,
  Typography,
  withStyles,
  Grid,
  styled,
  InputAdornment,
} from "@material-ui/core";
import LoansService from "../../services/loans.service";
import DocumentsService from "../../services/documents.service";
import { Create, School, Room, CloudUpload, Today } from "@material-ui/icons";
import DAI from "../../components/DAI";
import ProgressBar from "../../components/Progress";
import Status from "../../components/Status";
import { useFormik } from "formik";
import * as Yup from "yup";
import Toast from "../../components/Toast";
import { Redirect, useHistory } from "react-router";
import loansTransactionsService from "../../services/loans-transactions.service";

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

const createForm = (loan_id, is_public, setToast, setOpen) => {
  return useFormik({
    initialValues: {
      name: "",
      document: "",
    },
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      const { name, document } = values;
      const valid = await DocumentsService.uploadDocument(
        loan_id,
        name,
        document,
        is_public
      );

      if (valid) {
        setToast({
          message: "Document uploaded!",
          severity: "success",
        });
      } else {
        setToast({
          message: "Something went wrong!",
          severity: "error",
        });
      }
      resetForm({});
      setOpen(true);
      setSubmitting(false);
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required("Name is required"),
      document: Yup.mixed()
        .required("A file is required")
        .test(
          "fileFormat",
          "Unsupported Format",
          (value) => value && ["application/pdf"].includes(value.type)
        ),
    }),
  });
};

const ManageLoan = (props) => {
  const loanID = props.match.params.id;
  const [loan, setLoan] = useState({});
  const [isLoading, setLoading] = useState(true);
  const [payback, setPayback] = useState(0);

  // Toast
  const [toast, setToast] = React.useState({});
  const [open, setOpen] = React.useState(false);
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const public_docs_form = createForm(loanID, true, setToast, setOpen);
  const private_docs_form = createForm(loanID, false, setToast, setOpen);

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
    return ["PENDING", "FUNDING", "ACTIVE", "FINALIZED"].includes(
      status.toUpperCase()
    );
  };

  const canPayback = (status) => {
    return ["ACTIVE"].includes(status.toUpperCase());
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

  const clickPayback = async (id) => {
    try {
      await loansTransactionsService.makePayment(id, payback);
      setToast({
        message: "Payment successful",
        severity: "success",
      });
      setOpen(true);
      setPayback("");
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
          <Box pl={2}>
            <Status state={loan.state} />
          </Box>
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
        <Grid container spacing={2}>
          <Grid item xs={12} lg={6}>
            <Panel>
              <Typography variant="h5" color="secondary">
                Public Documents
              </Typography>
              <Typography variant="body1" color="textSecondary" paragraph>
                Submit documents relative to your academic achievements,
                diplomas and other documents to valorize yourself. These
                documents will be public for investors.
              </Typography>
              <form onSubmit={public_docs_form.handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      label="File name"
                      name="name"
                      value={public_docs_form.values.name}
                      onChange={public_docs_form.handleChange}
                      onBlur={public_docs_form.handleBlur}
                      error={
                        public_docs_form.errors.name &&
                        public_docs_form.touched.name
                      }
                      helperText={
                        public_docs_form.errors.name &&
                        public_docs_form.touched.name &&
                        public_docs_form.errors.name
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      type="file"
                      variant="outlined"
                      name="document"
                      inputProps={{
                        accept: "application/pdf",
                      }}
                      onChange={(event) => {
                        public_docs_form.setFieldValue(
                          "document",
                          event.currentTarget.files[0]
                        );
                      }}
                      error={
                        public_docs_form.errors.document &&
                        public_docs_form.touched.document
                      }
                      helperText={
                        public_docs_form.errors.document &&
                        public_docs_form.touched.document &&
                        public_docs_form.errors.document
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Box display="flex" justifyContent="flex-end">
                      <Button
                        type="submit"
                        variant="contained"
                        color="secondary"
                        startIcon={<CloudUpload />}
                        disabled={!canSubmitDocuments(loan.state)}
                      >
                        Upload
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </form>
            </Panel>
          </Grid>
          <Grid item xs={12} lg={6}>
            <Panel>
              <Typography variant="h5" color="secondary">
                Private Documents
              </Typography>
              <Typography variant="body1" color="textSecondary" paragraph>
                Submit documents relative to your incomes, current job and other
                documents relative to your professional status. These documents
                will be private for invertors.
              </Typography>
              <form onSubmit={private_docs_form.handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      label="File name"
                      name="name"
                      value={private_docs_form.values.name}
                      onChange={private_docs_form.handleChange}
                      onBlur={private_docs_form.handleBlur}
                      error={
                        private_docs_form.errors.name &&
                        private_docs_form.touched.name
                      }
                      helperText={
                        private_docs_form.errors.name &&
                        private_docs_form.touched.name &&
                        private_docs_form.errors.name
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      type="file"
                      variant="outlined"
                      name="document"
                      inputProps={{
                        accept: "application/pdf",
                      }}
                      onChange={(event) => {
                        private_docs_form.setFieldValue(
                          "document",
                          event.currentTarget.files[0]
                        );
                      }}
                      error={
                        private_docs_form.errors.document &&
                        private_docs_form.touched.document
                      }
                      helperText={
                        private_docs_form.errors.document &&
                        private_docs_form.touched.document &&
                        private_docs_form.errors.document
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Box display="flex" justifyContent="flex-end">
                      <Button
                        type="submit"
                        variant="contained"
                        color="secondary"
                        startIcon={<CloudUpload />}
                        disabled={!canSubmitDocuments(loan.state)}
                      >
                        Upload
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </form>
            </Panel>
          </Grid>
        </Grid>

        <hr />

        <Panel>
          <Typography variant="h5" color="secondary">
            Payback
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Payback your monthly fee (this depends on your current salary)
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Box display="flex" pt={2}>
                <TextField
                  type="number"
                  label="Payback"
                  name="payback"
                  variant="outlined"
                  fullWidth
                  InputProps={{
                    inputProps: { min: 1 },
                    endAdornment: (
                      <InputAdornment position="end">
                        <DAI />
                      </InputAdornment>
                    ),
                  }}
                  onChange={(e) => {
                    setPayback(e.target.value);
                  }}
                  value={payback}
                />
                <Button
                  variant="contained"
                  color="secondary"
                  disabled={!canPayback(loan.state)}
                  onClick={() => clickPayback(loan.id)}
                >
                  Payback
                </Button>
              </Box>
            </Grid>
          </Grid>
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
