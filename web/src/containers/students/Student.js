import PropTypes from "prop-types";
<<<<<<< Updated upstream
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
=======
import React, { useEffect, useState } from "react";
import ProgressBar from "../../components/Progress";
import LoanRequestService from "../../services/loanrequest.service";
import UserService from "../../services/user.service";
import { Home, Euro, Create, School, Room } from "@material-ui/icons";
>>>>>>> Stashed changes
import {
  Typography,
  TextField,
  Button,
<<<<<<< Updated upstream
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
=======
  Grid,
  Box,
  useMediaQuery,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

function Student(props) {
  let [user, setUser] = useState({});
  let [userInfo, setUserInfo] = useState({});
  let [percentage, setPercentage] = useState(0);
  let [tokens, setTokens] = useState(0);
  useEffect(async () => {
    const temp = await LoanRequestService.getLoanRequest(props.match.params.id);
    setUser(temp);
    console.log(temp);
    setPercentage((temp.current_amount / temp.amount) * 100);
    console.log(percentage);
    const Info = await UserService.getUserInfo(temp.student);
    setUserInfo(Info.user);
    console.log(Info.user);
  }, []);
  const matches = useMediaQuery("(min-width:600px)");
  const Box2 = withStyles({
    root: {
      justifyContent: matches === false ? "center" : "inherit",
      display: "flex",
      paddingBottom: "5%",
    },
  })(Box);
  const BoxDescr = withStyles({
    root: {
      paddingLeft: matches === false ? "12%" : "inherit",
      paddingRight: matches === false ? "12%" : "inherit",
      paddingBottom: matches === false ? "10%" : "inherit",
    },
  })(Box);
  return (
    <Box className="student" component="span" m={1}>
      <Grid container spacing={2} className="container">
        <Grid className="left-cont" item xs={12} md={6}>
          <Box>
            <img src={userInfo.photo} />
          </Box>
        </Grid>
        <Grid className="right-cont" item xs={12} md={6}>
          <Box className="right">
            <Box2 alignItems="baseline" className="header">
              <Typography variant="h2" display="inline">
                {userInfo.username}
              </Typography>
            </Box2>
            <Box2 className="up">
              <Box className="par-init" display="flex">
                <School />
                <Typography variant="body1" display="inline">
                  {user.degree}
                </Typography>
              </Box>
              <Box className="par" display="flex" paddingLeft="5%">
                <Create />
                <Typography variant="body1">{user.course}</Typography>
              </Box>
              <Box className="par" display="flex" paddingLeft="5%">
                <Room />
                <Typography variant="body1" display="inline">
                  {userInfo.country}
                </Typography>
              </Box>
            </Box2>
            <Box2 className="down">
              <Box className="par-init" display="flex">
                <Home />
                <Typography variant="body1" display="inline">
                  {user.school}
                </Typography>
              </Box>
              <Box className="par" display="flex" paddingLeft="5%">
                <Euro />
                <Typography variant="body1" display="inline">
                  {user.amount}
                </Typography>
              </Box>
            </Box2>
          </Box>
          <BoxDescr className="description">
            <Typography variant="body1" display="inline">
              {user.description}
            </Typography>
          </BoxDescr>
        </Grid>
        <Grid container spacing={2} className="container">
          <Grid item xs={12} md={6}>
            <Box
              className="left-tok"
              width="fit-content"
              marginLeft="auto"
              marginRight="auto"
            >
              <Box pt="10%">
                {" "}
                <Typography variant="h3">{"Tokens"}</Typography>
              </Box>
              <Box pb="5%" pt="5%">
                <Typography variant="h4">{"Buy"}</Typography>{" "}
              </Box>
              <Box className="token">
                <TextField
                  label="Tokens"
                  name="tokens"
                  variant="outlined"
                  onChange={(e) => {
                    Number.isInteger(parseInt(e.target.value))
                      ? setTokens(e.target.value)
                      : setTokens(0);
                    console.log(tokens);
                  }}
                />
                <Button variant="contained" color="primary" type="submit">
                  Buy
                </Button>
              </Box>
              <Box className="barra" paddingTop="5%">
                <ProgressBar completed={percentage} />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
>>>>>>> Stashed changes

Student.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
    }),
  }),
};

export default Student;