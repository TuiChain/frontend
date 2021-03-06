import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  TextField,
  Button,
  Grid,
  Box,
  Typography,
  withStyles,
  InputAdornment,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { useFormik } from "formik";
import * as Yup from "yup";
import LoansService from "../../services/loans.service";
import { useHistory } from "react-router";
import { countries } from "../../util/countries";
import DAI from "../../components/DAI";
import Web3 from "web3";
import userService from "../../services/user.service";

const styles = (theme) => ({
  fullWidth: {
    width: "100%",
  },
  form: {
    [theme.breakpoints.only("md")]: {
      paddingLeft: "10%",
      paddingRight: "10%",
    },
    [theme.breakpoints.up("lg")]: {
      paddingLeft: "15%",
      paddingRight: "15%",
    },
  },
});

const LoanRequest = (props) => {
  const { classes, wallet } = props;

  const history = useHistory();

  const [recipient_touched, setRecipientTouched] = useState(false);
  const [loading, setLoading] = useState(true);

  const [kyc, setKYC] = useState(false);
  useEffect(() => {
    const fetchUser = async () => {
      const [, kyc] = await userService.getCurrentUserInfo();
      console.log(kyc);
      if (kyc.validated) {
        setKYC(true);
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  const formik = useFormik({
    initialValues: {
      school: "",
      course: "",
      amount: 0,
      desc: "",
      destination: "",
      recipient_address: "",
      error: null,
    },
    onSubmit: async (values, { setSubmitting, setFieldValue }) => {
      const {
        school,
        course,
        amount,
        desc,
        destination,
        recipient_address,
      } = values;

      try {
        const loan_id = await LoansService.createLoan(
          school,
          course,
          amount,
          desc,
          destination,
          recipient_address
        );

        setSubmitting(false);
        history.replace("/personal/loans/" + loan_id);
      } catch (e) {
        const error = e.response.data.error;
        let message = error.includes("cannot create Loan Requests")
          ? "You can only have one loan request at a time."
          : error.includes("Invalid address")
          ? "Invalid Account Address checksum."
          : error;

        setFieldValue(
          "error",
          <Grid item xs={12}>
            <Alert severity="error">{message}</Alert>
          </Grid>
        );
        setSubmitting(false);
      }
    },
    validationSchema: Yup.object().shape({
      school: Yup.string().required("School is required"),
      course: Yup.string().required("Course is required"),
      amount: Yup.number().min(1),
      desc: Yup.string().required("Description is required"),
      destination: Yup.string().required("Destination is required"),
      recipient_address: Yup.string()
        .required("An Account Address is required")
        .test("checksum", "Invalid Account Address checksum", (value) =>
          Web3.utils.isAddress(value)
        ),
    }),
  });

  return (
    <div>
      <Typography variant="h2" paragraph>
        Loan Request
      </Typography>

      <form onSubmit={formik.handleSubmit} className={classes.fullWidth}>
        <Grid className={classes.form} container spacing={2}>
          {!loading && !kyc && (
            <Box py={2} width="100%">
              <Alert severity="error">Please, finish your KYC process.</Alert>
            </Box>
          )}
          {/* TODO: form validation */}
          <Grid item xs={12}>
            <FormControl variant="outlined" fullWidth name="destination">
              <InputLabel htmlFor="outlined-age-native-simple">
                Destination
              </InputLabel>
              <Select
                native
                value={formik.values.destination}
                onChange={formik.handleChange("destination")}
                label="Destination"
                name="destinantion"
                inputProps={{
                  name: "destination",
                  id: "outlined-age-native-simple",
                }}
              >
                <option aria-label="None" value="" />
                {countries.map((n) => (
                  <option key={n.name} value={n.name}>
                    {n.name}
                  </option>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField
              error={formik.errors.school && formik.touched.school}
              label="School"
              name="school"
              value={formik.values.school}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              helperText={
                formik.errors.school &&
                formik.touched.school &&
                formik.errors.school
              }
              variant="outlined"
              fullWidth
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              error={formik.errors.course && formik.touched.course}
              label="Course"
              name="course"
              value={formik.values.course}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              helperText={
                formik.errors.course &&
                formik.touched.course &&
                formik.errors.course
              }
              variant="outlined"
              fullWidth
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              error={formik.errors.amount && formik.touched.amount}
              label="Amount"
              name="amount"
              value={formik.values.amount}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              helperText={
                formik.errors.amount &&
                formik.touched.amount &&
                formik.errors.amount
              }
              type="number"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <DAI />
                  </InputAdornment>
                ),
              }}
              variant="outlined"
              fullWidth
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              error={formik.errors.desc && formik.touched.desc}
              label="Description"
              name="desc"
              value={formik.values.desc}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              helperText={
                formik.errors.desc && formik.touched.desc && formik.errors.desc
              }
              variant="outlined"
              fullWidth
              multiline
              rows={4}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              error={
                formik.errors.recipient_address &&
                formik.touched.recipient_address
              }
              label={
                wallet
                  ? recipient_touched
                    ? "Account Address"
                    : "Selected Account Address: " +
                      Web3.utils.toChecksumAddress(wallet)
                  : "You need to install Metamask in order to proceed"
              }
              name="recipient_address"
              value={formik.values.recipient_address}
              onChange={formik.handleChange}
              onBlur={() =>
                formik.values.recipient_address == ""
                  ? setRecipientTouched(false)
                  : true
              }
              onFocus={() => {
                setRecipientTouched(true);
                if (formik.getFieldProps("recipient_address").value == "")
                  formik.setFieldValue(
                    "recipient_address",
                    Web3.utils.toChecksumAddress(wallet)
                  );
              }}
              helperText={
                formik.errors.recipient_address &&
                formik.touched.recipient_address &&
                formik.errors.recipient_address
              }
              variant="outlined"
              disabled={!wallet}
              fullWidth
            />
          </Grid>

          {formik.values.error}

          <Grid container justify="flex-end">
            <Button
              variant="contained"
              color="secondary"
              type="button"
              onClick={formik.handleReset}
              disabled={!formik.dirty || formik.isSubmitting}
            >
              Reset
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={!wallet || !kyc || formik.isSubmitting}
            >
              {formik.isSubmitting ? (
                <CircularProgress color="secondary" size={20} />
              ) : (
                "Request!"
              )}
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

LoanRequest.propTypes = {
  classes: PropTypes.object,
  wallet: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number, // 0 - uninstalled
  ]),
};

export default withStyles(styles)(LoanRequest);
