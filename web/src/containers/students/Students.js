import React, { useState, useEffect } from "react";
import getStudents from "../../services/students.service";
import { Grid, Input } from "@material-ui/core";
import { styled } from "@material-ui/core/styles";
import StudentCard from "../../components/StudentCard";
import theme from "../../theme";
import PropTypes from "prop-types";

const StudentsGrid = styled(Grid)({
  paddingLeft: "10%",
  paddingRight: "10%",

  [theme.breakpoints.only("sm")]: {
    paddingLeft: "30%",
    paddingRight: "30%",
  },
  [theme.breakpoints.only("xs")]: {
    paddingLeft: "15%",
    paddingRight: "15%",
  },
});

const SearchArea =  styled(Grid)({
  paddingLeft: "10%",
  paddingRight: "10%",
  paddingBottom: "4%",
  paddingTop: "2%",
})

const SearchBar = ({ input: keyword, onChange: setKeyword }) => {
  const BarStyling = {
    background: "#EFF0F6",
    padding: "0.7rem",
    borderRadius: 20,
  };
  return (
    <Input
      fullWidth
      disableUnderline
      style={BarStyling}
      value={keyword}
      placeholder={"Search for a student..."}
      onChange={(e) => setKeyword(e.target.value)}
    />
  );
};

const Students = () => {
  const [searchInput, setInput] = useState("");
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);

  useEffect(() => {
    getStudents().then((studentList) => {
      setStudents(studentList);
      setFilteredStudents(studentList);
    });
  }, []);

  const updateInput = async (input) => {
    const filtered = students.filter((student) => {
      return student.name.toLowerCase().includes(input.toLowerCase());
    });
    setInput(input);
    setFilteredStudents(filtered);
  };

  return (
    <>
      <SearchArea>
        <SearchBar input={searchInput} onChange={updateInput} />
      </SearchArea>

      <StudentsGrid
        container
        direction="row"
        justify="center"
        alignItems="center"
        spacing={10}
      >
        {filteredStudents.map(
          ({
            id,
            name,
            photo,
            likes,
            degree,
            origin,
            course,
            university,
            tuition,
          }) => {
            return (
              <Grid key={id} item xs={12} md={4} xl={3}>
                <StudentCard
                  name={name}
                  photo={photo}
                  degree={degree}
                  likes={likes}
                  university={university}
                  course={course}
                  origin={origin}
                  tuition={tuition}
                />
              </Grid>
            );
          }
        )}
      </StudentsGrid>
    </>
  );
};

export default Students;

SearchBar.propTypes = {
  input: PropTypes.string,
  onChange: PropTypes.func,
};
