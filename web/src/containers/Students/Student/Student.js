import PropTypes from "prop-types";
import React, {useEffect,useState } from 'react';
import './Student.css';
import ProgressBar from "./ProgressBar";
const axios = require('axios');
import{
  Home,
  Euro,
  FavoriteBorder,
  Create,
  School,
  Room
} from '@material-ui/icons';
import {
  Button,
  Grid
} from "@material-ui/core";


function Student() {
    let [user,setUser]= useState({});
    useEffect(()=>{
      axios.get("https://my-json-server.typicode.com/pferreira101/tuichain_faker/student").then(response=>{setUser(response.data)});
    },[]);
    const completed=90;
    const bg="#3AAFA9";
    return (
      <div className="student">
       <Grid container spacing={2} className="container">
        <Grid className="left-cont" item xs={12} md={6}>
        <div>
        <img src={user.photo}/>
        </div>
        <div className="left-tok">
          <h2>
          Buy Tokens
          </h2>
          <div className="token">          
            <input placeholder="Tokens"/>
            <Button  variant="outlined">Buy</Button>
          </div>
          <div className="barra">
          <ProgressBar bgcolor={bg} completed={completed}/>
          </div>
        </div>
        </Grid>
        <Grid className="right-cont" item xs={12} md={6}>
        <div className="right">
          <div className="header">
           <h1>{user.name}</h1> 
            <div className="likes"> 
              <FavoriteBorder className="like"/>
              <p>{user.likes}</p>
              <h1></h1>
            </div>
          </div>
          <div className="mid">
            <div className="up">
              <div className="par">
                <School/>
                <p>{user.degree}</p>
              </div>  
              <div className="par">
                <Create/>
                <p>{user.course}</p>
              </div>  
              <div className="par">
                <Room/>
                <p>{user.origin}</p>
              </div>  
            </div>
            <div className="down">
              <div className="par">
                <Home/>
                <p>{user.university}</p>
              </div>
              <div className="par">
                <Euro/>
                <p>{user.tuition}</p>
              </div>
            </div>
          </div>
          <div className="description">
            <p>{user.description}</p>
          </div>
          </div> 
        </Grid>
        </Grid> 
      </div>
    );
  }

Student.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }),
  }),
};

export default Student;
