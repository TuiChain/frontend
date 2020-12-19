import React from "react";
import PropTypes from "prop-types";

const ProgressBar = ({bgcolor, completed}) => {
  const containerStyles = {
    height: 20,
    width: '100%',
    backgroundColor: "#e0e0de",
    borderRadius: 50,
  }
  
  const fillerStyles = {
    height: '100%',
    width: `${completed}%`,
    backgroundColor: bgcolor,
    borderRadius: 'inherit',
    textAlign: 'right'
  }

  const labelStyles = {
    padding: 20,
    color: 'white',
    fontWeight: 'bold'
  }

  return (
    <div style={containerStyles}>
      <div style={fillerStyles}>
        <span style={labelStyles}>{`${completed}%`}</span>
      </div>
    </div>
  );
};
ProgressBar.propTypes = {
  bgcolor: PropTypes.string,
  completed: PropTypes.number,
};
export default ProgressBar;