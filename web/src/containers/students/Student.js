import React from "react";
import PropTypes from "prop-types";

const Student = (props) => {
  return <div>Student #{props.match.params.id}</div>;
};

Student.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }),
  }),
};

export default Student;
