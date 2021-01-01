import PropTypes from "prop-types";
import React, {useEffect,useState } from 'react';
import './Student.css';
import ProgressBar from "./Progress";
const axios = require('axios');
import Box from '@material-ui/core/Box';
import{
  Home,
  Euro,
  FavoriteBorder,
  Create,
  School,
  Room
} from '@material-ui/icons';
import {
  Typography,
  TextField,
  Button,
  Grid
} from "@material-ui/core";


function Student() {
    let [user,setUser]= useState({});
    useEffect(()=>{
      axios.get("https://my-json-server.typicode.com/pferreira101/tuichain_faker/student").then(response=>{setUser(response.data)});
    },[]);
    return (
      <Box className="student" component="span" m={1}>
       <Grid container spacing={2} className="container">
        <Grid className="left-cont" item xs={12} md={6}>
        <Box>
        <img src={user.photo}/>
        </Box>
        </Grid>
        <Grid className="right-cont" item xs={12} md={6}>
        <Box className="right">
          <Box className="header">
           <Typography variant="h2" display="inline">{user.name}</Typography> 
            <Box className="likes"> 
              <FavoriteBorder className="like"/>
              <p>{user.likes}</p>
              <h1></h1>
            </Box>
          </Box>
            <Box className="up">
              <Box className="par-init">
                <School/>
                <p>{user.degree}</p>
              </Box>  
              <Box className="par">
                <Create/>
                <p>{user.course}</p>
              </Box>  
              <Box className="par">
                <Room/>
                <p>{user.origin}</p>
              </Box>  
            </Box>
            <Box className="down">
              <Box className="par-init">
                <Home/>
                <p>{user.university}</p>
              </Box>
              <Box className="par">
                <Euro/>
                <p>{user.tuition}</p>
              </Box>
            </Box>
            </Box>
          <Box className="description">
            <p>{user.description}</p>
          </Box> 
        </Grid>
        <Grid container spacing={2} className="container">
        <Grid item xs={12} md={6}>
          <Box className="left-tok">
          <h1>Tokens</h1>
          <h2>
          Buy
          </h2>
          <Box className="token">          
          <TextField
              label="Tokens"
              name="tokens"
              variant="outlined"
            />
            <Button  variant="contained" color="primary" type="submit">Buy</Button>
          </Box>
          <Box className="barra">
          <ProgressBar completed={90}/>
          </Box>
          </Box>
        </Grid>
        </Grid>
        </Grid> 
      </Box>
    );
  }

Student.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
    }),
  }),
};

export default Student;