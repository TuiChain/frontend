import React from "react";
import PropTypes from "prop-types";

class Student extends React.Component {
  render() {
    return <div>Student #{this.props.match.params.id}</div>;
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
