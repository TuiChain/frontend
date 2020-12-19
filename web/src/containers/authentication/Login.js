import React from "react";
import PropTypes from "prop-types";
import {
  TextField,
  Button,
  withStyles,
  Grid,
  Typography,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { useFormik } from "formik";
import * as Yup from "yup";
import AuthService from "../../services/auth.service";

const styles = {
  margin: {
    padding: "20px 0",
  },
  center: {
    padding: "0 20%",
  },
  fullWidth: {
    width: "100%",
  },
};

const Login = (props) => {
  const { classes, onLogin } = props;

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
      error: null,
    },
    onSubmit: async (values, { setSubmitting, setFieldValue }) => {
      const { username, password } = values;
      setFieldValue("error", null);

      const auth = await AuthService.login(username, password);

      if (auth) {
        setSubmitting(false);

        onLogin(auth);
      } else {
        setFieldValue(
          "error",
          <Grid item xs={12} className={classes.margin}>
            <Alert severity="error">Your credentials doesn&#39;t match.</Alert>
          </Grid>
        );
        setSubmitting(false);
      }
    },
    validationSchema: Yup.object().shape({
      username: Yup.string().required("Username is required"),
      password: Yup.string().required("Password is required"),
    }),
  });

  return (
    <div className={classes.center}>
      <Typography variant="h2" paragraph>
        Login
      </Typography>
      <form onSubmit={formik.handleSubmit} className={classes.fullWidth}>
        <Grid container spacing={2}>
          <Grid item xs={12} className={classes.margin}>
            <TextField
              error={formik.errors.username && formik.touched.username}
              label="Username"
              name="username"
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              helperText={
                formik.errors.username &&
                formik.touched.username &&
                formik.errors.username
              }
              variant="outlined"
              fullWidth
            />
          </Grid>

          <Grid item xs={12} className={classes.margin}>
            <TextField
              error={formik.errors.password && formik.touched.password}
              label="Password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              helperText={
                formik.errors.password &&
                formik.touched.password &&
                formik.errors.password
              }
              type="password"
              variant="outlined"
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
              disabled={formik.isSubmitting}
            >
              Login
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

Login.propTypes = {
  classes: PropTypes.object,
  onLogin: PropTypes.func,
};

export default withStyles(styles)(Login);
