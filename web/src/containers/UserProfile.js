import PropTypes from "prop-types";
import React, { useEffect } from "react";
import UserService from "../services/user.service";
import {TextField,Select,Box,Grid,FormControl,InputLabel,Button} from '@material-ui/core';
import { useFormik } from "formik";
import * as Yup from "yup";
import { countries } from "../util/countries";
import KycButton from "./KycButton";
function UserProfile() {
    useEffect(async ()=>{
    const tempUser= await UserService.getPersonalInfo();
    formik.setValues(tempUser.user);
    console.log(formik.values.username)
},[]);

const getBase64 = (file) => new Promise(function (resolve, reject) {
  let reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result)
  reader.onerror = (error) => reject('Error: ', error);
});
const changeImg = (e) => {
  const file = e.target.files[0];
  getBase64(file)
    .then((result) => {
      console.log(result);
     })
    .catch(e => console.log(e))
}
    const formik = useFormik({
        initialValues: {
          username: "",
          bio: "",
          country:"",
          image:"",
          zip_code:"",
          full_name:"",
          city:"",
          error: null,
        },
        onSubmit: async (values, {setFieldValue }) => {
          setFieldValue("error", null);
        },
        validationSchema: Yup.object().shape({
          username: Yup.string().required("Username is required"),
          bio: Yup.string().required("Password is required")
        }),
      });
return( 
<Grid container spacing={2}>
<Grid  item xs={12}>   
<Box display="block" paddingBottom="2%">
<TextField
        fullWidth
        label="Username"
        value={formik.values.username}
        variant="filled"
        id="reddit-input"
        onChange={formik.handleChange("username")}
      />
</Box>  
<Box paddingBottom="2%">        
<TextField
        fullWidth
        label="Full name"
        value={formik.values.full_name}
        variant="filled"
        id="reddit-input"
        onChange={formik.handleChange("full_name")}
      />         
</Box>
<Box paddingBottom="2%">        
<TextField
        fullWidth
        label="Bio"
        value={formik.values.bio}
        variant="filled"
        id="reddit-input"
        onChange={formik.handleChange("bio")}
      />         
</Box>
<Box paddingBottom="2%">        
<TextField
        fullWidth
        label="City"
        value={formik.values.city}
        variant="filled"
        id="reddit-input"
        onChange={formik.handleChange("city")}
      />         
</Box>
<Box paddingBottom="2%">        
<TextField
        fullWidth
        label="Zip-Code"
        value={formik.values.zip_code}
        variant="filled"
        id="reddit-input"
        onChange={formik.handleChange("zip_code")}
      />         
</Box>
<FormControl variant="filled" fullWidth name="destination">
              <InputLabel htmlFor="outlined-age-native-simple">
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
            <Box paddingTop="1%">
            <Button
                variant="contained"
                component="label"
                >
                Upload Photo
                <input
                    type="file"
                    hidden
                    onChange={changeImg}
                />
                </Button>
                </Box>
                <KycButton/>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={formik.isSubmitting}
            >
              Save
            </Button>
</Grid>    
</Grid>  
);
}

UserProfile.propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
      }),
    }),
  };
  
  
  export default UserProfile;