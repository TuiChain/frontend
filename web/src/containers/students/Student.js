import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import ProgressBar from "../../components/Progress";
import LoanRequestService from "../../services/loans.service";
import UserService from "../../services/user.service";
import InvestmentService from "../../services/investment.service";
import { Euro, Create, School, Room } from "@material-ui/icons";
import {
  Typography,
  TextField,
  Button,
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
    const temp = await LoanRequestService.getLoan(props.match.params.id);
    setUser(temp);
    console.log(temp);
    setPercentage((temp.funded_value_atto_dai / temp.requested_value_atto_dai) * 100);
    console.log(percentage);
    const Info = await UserService.getUserInfo(temp.student);
    setUserInfo(Info.user);
    console.log(Info.user);
  }, []);
  let clickHandler=()=>{
    let inv={
      amount:tokens,
      request:props.match.params.id
    };
    console.log(inv);
    InvestmentService.newInvestment(inv);
  };
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
            <img src={userInfo.profile_image} />
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
                {user.school}
                </Typography>
              </Box>
              <Box className="par" display="flex" paddingLeft="5%">
                <Create />
                <Typography variant="body1">{user.course}</Typography>
              </Box>
            </Box2>
            <Box2 className="down">
            <Box className="par" display="flex">
                <Room />
                <Typography variant="body1" display="inline">
                  {user.destination}
                </Typography>
              </Box>
              <Box className="par" display="flex" paddingLeft="5%">
                <Euro />
                <Typography variant="body1" display="inline">
                {user.requested_value_atto_dai/Math.pow(10,18)}
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
          {user.state==="PENDING" && (<Box>
              <Typography variant="h3">Request waiting for approval</Typography>
            </Box>)
            }
          {user.state!="PENDING" && (<Box
              className="left-tok"
              width="fit-content"
              marginLeft="auto"
              marginRight="auto"
            >
              <Box pt="10%" marginBottom="10%">
                <Typography variant="h3">{"Tokens"}</Typography>
              </Box>
              <Box className="token">
                <TextField
                  type={"number"}
                  label="Tokens"
                  name="tokens"
                  variant="outlined"
                  InputProps={{ inputProps: { min: 0} }}
                  onChange={(e) => {
                  setTokens(e.target.value)
                  console.log(tokens);
                  }}
                />
                <Button variant="contained" color="primary" type="submit" onClick={clickHandler}>
                  Buy
                </Button>
              </Box>
              <Box className="barra" paddingTop="5%">
                <ProgressBar completed={percentage} />
              </Box>
            </Box>)}
          </Grid>
        </Grid>
      </Grid>
    </Box>
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
