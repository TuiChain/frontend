import PropTypes from "prop-types";
import React from 'react';
import './Student.css';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import HomeIcon from '@material-ui/icons/Home';
import EuroIcon from '@material-ui/icons/Euro';
import RoomIcon from '@material-ui/icons/Room';
import CreateIcon from '@material-ui/icons/Create';
import SchoolIcon from '@material-ui/icons/School';
import Button from '@material-ui/core/Button';
import ProgressBar from "./ProgressBar";
const axios = require('axios').default;


class Student extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
    };
  }
  componentDidMount() {
    axios.get("https://my-json-server.typicode.com/pferreira101/tuichain_faker/student").then(response=>{this.setState({user: response.data})});
  }
  render() {
    const completed=90;
    const bg="#3AAFA9";
    return (
      <div className="student">
        <div className="left-cont">
        <img src={this.state.user.photo}/>
        <div>
          <div className="titles">
          <h2>Buy Tokens</h2>
          </div>
          <div className="token">          
            <input placeholder="Tokens"/>
            <Button  variant="outlined">Buy</Button>
          </div>
          <div className="barra">
          <ProgressBar bgcolor={bg} completed={completed}/>
          </div>
        </div>
        </div>
        <div className="right-cont">
          <div className="header">
          <div className="nome"> <h1>{this.state.user.name}</h1> 
            </div>
            <div className="likes"> 
              <FavoriteBorderIcon className="like"/>
              <p>{this.state.user.likes}</p>
            </div>
          </div>
          <div className="mid">
            <div className="up">
              <div className="par">
                <SchoolIcon/>
                <p>{this.state.user.degree}</p>
              </div>  
              <div className="par">
                <CreateIcon/>
                <p>{this.state.user.course}</p>
              </div>  
              <div className="par">
                <RoomIcon/>
                <p>{this.state.user.origin}</p>
              </div>  
            </div>
            <div className="down">
              <div className="par">
                <HomeIcon/>
                <p>{this.state.user.university}</p>
              </div>
              <div className="par">
                <EuroIcon/>
                <p>{this.state.user.tuition}</p>
              </div>
            </div>
          </div>
          <div className="description">
            <p>{this.state.user.description}</p>
          </div>
        </div>
      </div>
    );
  }
}

Student.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }),
  }),
};

export default Student;
