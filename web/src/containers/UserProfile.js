import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import UserService from "../services/user.service";
import {
  TextField,
  Select,
  Box,
  Grid,
  FormControl,
  InputLabel,
  Button,
  Typography,
} from "@material-ui/core";
import { CloudUpload } from "@material-ui/icons";
import { useFormik } from "formik";
import { countries } from "../util/countries";
import KycButton from "../components/KycButton";

function UserProfile() {
  const formik = useFormik({
    initialValues: {
      address: "",
      short_bio: "",
      country: "",
      image: "",
      zip_code: "",
      full_name: "",
      city: "",
      error: null,
    },
  });

  const onSubmit = async () => {
    var formData = new FormData();
    formData.append("full_name", formik.values.full_name);
    formData.append("address", formik.values.address);
    formData.append("zip_code", formik.values.zip_code);
    formData.append("short_bio", formik.values.short_bio);
    formData.append("city", formik.values.city);
    formData.append("country", formik.values.country);
    UserService.updateInfo(formData);
  };

  const [verificationStatus, setVerificationStatus] = useState(undefined);
  const [intentId, setintentId] = useState(undefined);

  const fetchUser = async () => {
    const [tempUser, verification_id] = await UserService.getCurrentUserInfo();

    tempUser.full_name === null
      ? formik.setFieldValue("full_name", "")
      : formik.setFieldValue("full_name", tempUser.full_name);
    tempUser.full_name === null
      ? formik.setFieldValue("short_bio", "")
      : formik.setFieldValue("short_bio", tempUser.short_bio);
    tempUser.full_name === null
      ? formik.setFieldValue("city", "")
      : formik.setFieldValue("city", tempUser.city);
    tempUser.full_name === null
      ? formik.setFieldValue("zip_code", "")
      : formik.setFieldValue("zip_code", tempUser.zip_code);
    tempUser.full_name === null
      ? formik.setFieldValue("address", "")
      : formik.setFieldValue("address", tempUser.address);
    tempUser.full_name === null
      ? formik.setFieldValue("country", "")
      : formik.setFieldValue("country", tempUser.country);

    if (verification_id.verification_id) {
      setintentId(verification_id.verification_id);

      if (verification_id.validated !== undefined) {
        if (verification_id.validated) {
          setVerificationStatus("succeeded");
        } else {
          setVerificationStatus("processing");
        }
      }
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  var formPic = new FormData();
  const changeImg = (e) => {
    const file = e.target.files[0];
    formPic.append("profile_pic", file);
  };
  const submitImg = () => {
    UserService.updateInfo(formPic);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Box py={2}>
          <Typography variant="h5" color="secondary">
            Personal Info
          </Typography>
          <Typography variant="body1" color="textSecondary" paragraph>
            Fill in the fields below with your personal information and then
            click save.
          </Typography>
          <TextField
            fullWidth
            label="Full name"
            value={formik.values.full_name}
            variant="outlined"
            onChange={formik.handleChange("full_name")}
          />
        </Box>
        <Box paddingBottom="2%">
          <TextField
            fullWidth
            label="Bio"
            value={formik.values.short_bio}
            variant="outlined"
            onChange={formik.handleChange("short_bio")}
          />
        </Box>
        <Box paddingBottom="2%">
          <TextField
            fullWidth
            label="City"
            value={formik.values.city}
            variant="outlined"
            onChange={formik.handleChange("city")}
          />
        </Box>
        <Box paddingBottom="2%">
          <TextField
            fullWidth
            label="Zip-Code"
            value={formik.values.zip_code}
            variant="outlined"
            onChange={formik.handleChange("zip_code")}
          />
        </Box>
        <Box display="block" paddingBottom="2%">
          <TextField
            fullWidth
            label="Address"
            value={formik.values.address}
            variant="outlined"
            onChange={formik.handleChange("address")}
          />
        </Box>
        <FormControl variant="outlined" fullWidth name="country">
          <InputLabel shrink htmlFor="outlined-age-native-simple">
            Country
          </InputLabel>
          <Select
            native
            value={formik.values.country}
            onChange={formik.handleChange("country")}
            label="Country"
            name="country"
            inputProps={{
              name: "country",
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
        <Box display="flex" justifyContent="flex-end" pt={2}>
          <Button
            type="submit"
            variant="contained"
            color="secondary"
            disabled={formik.isSubmitting}
            onClick={onSubmit}
          >
            Save
          </Button>
        </Box>
        <hr />
        <Box py={2}>
          <Typography variant="h5" color="secondary">
            Profile Photo
          </Typography>
          <Typography variant="body1" color="textSecondary" paragraph>
            Submit a photo of yourself that will be used as your identification
            photo on your loans.
          </Typography>
          <Box display="flex">
            <TextField
              fullWidth
              type="file"
              variant="outlined"
              onChange={changeImg}
            />
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              disabled={formik.isSubmitting}
              startIcon={<CloudUpload />}
              onClick={submitImg}
            >
              Submit
            </Button>
          </Box>
        </Box>
        <hr />
        <Box pt={2}>
          <Typography variant="h5" color="secondary">
            Identity Verification
          </Typography>
          <Typography variant="body1" color="textSecondary" paragraph>
            Click the button below and follow the steps to verify your identity.
            If you don&apos;t complete this process you can&apos;t receive
            loans.
          </Typography>
          <KycButton
            verificationStatus={verificationStatus}
            intentId={intentId}
          />
        </Box>
      </Grid>
    </Grid>
  );
}

UserProfile.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({}),
  }),
};

export default UserProfile;
