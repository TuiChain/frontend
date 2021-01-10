import React from "react";
import PropTypes from "prop-types";
import {
  TextField,
  Button,
  Grid,
  Typography,
  withStyles,
  InputAdornment,
  Select,
  FormControl,
  InputLabel,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { useFormik } from "formik";
import * as Yup from "yup";
import LoanRequestService from "../services/loanrequest.service";
import { useHistory } from "react-router";
import { countries } from "../util/countries";

const styles = {
  fullWidth: {
    width: "100%",
  },
};

const LoanRequest = (props) => {
  const { classes } = props;
  const history = useHistory();

  const formik = useFormik({
    initialValues: {
      school: "",
      course: "",
      amount: 0,
      desc: "",
      destination: "",
      error: null,
    },
    onSubmit: async (values, { setSubmitting, setFieldValue }) => {
      const { school, course, amount, desc, destination } = values;
      console.log(school, course, amount, desc, destination);
      const valid = await LoanRequestService.createLoanRequest(
        school,
        course,
        amount,
        desc,
        destination
      );

      if (valid) {
        setSubmitting(false);
        history.replace("/");
      } else {
        setFieldValue(
          "error",
          <Grid item xs={12}>
            <Alert severity="error">
              You can only have one loan request at a time.
            </Alert>
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
    }),
  });

  return (
    <div>
      <Typography variant="h2" paragraph>
        Loan Request
      </Typography>
      <form onSubmit={formik.handleSubmit} className={classes.fullWidth}>
        <Grid container spacing={2}>
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
                endAdornment: <InputAdornment position="end">€</InputAdornment>,
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
              disabled={formik.isSubmitting}
            >
              Request!
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

LoanRequest.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(styles)(LoanRequest);
