import React from "react";
import PropTypes from "prop-types";

const ProgressBar = ({ completed}) => {
  const containerStyles = {
    height: 25,
    width: '100%',
    backgroundColor: "#e0e0de",
    borderRadius: 50,
  }
  
  const fillerStyles = {
    height: '100%',
    width: `${completed}%`,
    backgroundColor:"#3AAFA9",
    borderRadius: 'inherit',
    textAlign: 'center'
  }

  const labelStyles = {
    color: 'white',
    fontWeight: 'bold'
  }

  return (
    <div style={containerStyles}>
      <div style={fillerStyles}>
        <p style={labelStyles}>{`${completed}%`}</p>
      </div>
    </div>
  );
};
ProgressBar.propTypes = {
  completed: PropTypes.number,
};
export default ProgressBar;