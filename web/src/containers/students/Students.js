import React, { useState, useEffect } from "react";
import getStudents from "../../services/students.service";
import {
  Grid,
  Input,
  Typography,
  Select,
  Checkbox,
  FormControlLabel,
} from "@material-ui/core";
import { styled } from "@material-ui/core/styles";
import StudentCard from "../../components/StudentCard";
import theme from "../../theme";
import PropTypes from "prop-types";

const normalizeFilter = (obj) => {
  let allFlag = true;

  for (const [key, value] of Object.entries(obj))
    if(key !== 'All' && value)
      allFlag = false

  obj.All = allFlag

  return obj;
};

const getSelected = (obj) => {
  let selected = []

  for (const [key, value] of Object.entries(obj))
    value && selected.push(key)

  console.log(selected)

  return selected;
};

const updateCheckboxFilter = (selectedOption, filterStatus) => {
    let filter = {};
    filter = filterStatus
    if(!(selectedOption in filterStatus))
      filter[selectedOption] = true;
    else
      filter[selectedOption] = !filter[selectedOption];

    filter = normalizeFilter(filter)
    return filter;
};

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

const SearchArea = styled(Grid)({
  paddingLeft: "10%",
  paddingRight: "10%",
  paddingBottom: "4%",
  paddingTop: "2%",
});

const SearchBar = ({ input, handleInput }) => {
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
      value={input}
      placeholder={"Search for a student..."}
      onChange={(e) => handleInput(e.target.value)}
    />
  );
};

const CountryFilter = ({ countryList, handleCountry }) => {
  return (
    <>
      <Typography> Country </Typography>
      <Select native onChange={(e) => handleCountry(e.target.value)}>
        <option>All</option>
        {countryList.map((country) => (
          <option key={country}>{country}</option>
        ))}
        <option>Espanha</option>
      </Select>
    </>
  );
};

const CheckboxFilter = ({ name, optionList, handleOptionClick }) => {
  return (
    <>
      <Typography> {name} </Typography>
      <>
        {optionList.map((degree) => (
          <FormControlLabel
            key={degree}
            control={
              <Checkbox
                name={degree}
                onChange={(e) => handleOptionClick(e.target.name)}
              />
            }
            label={degree}
          />
        ))}
      </>
    </>
  );
};

const Students = () => {
  const [searchInput, setInput] = useState("");
  const [country, setCountry] = useState("All");
  const [degreeFilter, setDegreeFilter] = useState({ All: true });
  const [courseFilter, setCourseFilter] = useState({ All: true });
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);

  useEffect(() => {
    getStudents().then((studentList) => {
      setStudents(studentList);
      setFilteredStudents(studentList);
    });
  }, []);

  let countries = new Set();
  students.map((s) => {
    countries.add(s.origin);
  });

  let degrees = new Set();
  students.map((s) => {
    degrees.add(s.degree);
  });

  let courses = new Set();
  students.map((s) => {
    courses.add(s.course);
  });

  const updateInput = (input) => {
    setInput(input);
    filterStudents(input, country, degreeFilter, courseFilter);
  };

  const updateCountry = (country) => {
    setCountry(country);
    filterStudents(searchInput, country, degreeFilter, courseFilter);
  };

  const updateDegreeFilter = (selectedDegree) => {
    const updatedFilter = updateCheckboxFilter(selectedDegree, degreeFilter)
    setDegreeFilter(updatedFilter);
    filterStudents(searchInput, country, updatedFilter, courseFilter);
  };

  const updateCourseFilter = (selectedCourse) => {
    const updatedFilter = updateCheckboxFilter(selectedCourse, courseFilter)
    setCourseFilter(updatedFilter);
    filterStudents(searchInput, country, degreeFilter, updatedFilter);
  };

  const filterStudents = (searchInput, country, degreeFilter, courseFilter) => {
    let filtered = students;

    if (searchInput != "") {
      filtered = students.filter((student) => {
        return student.name.toLowerCase().includes(searchInput.toLowerCase());
      });
    }

    if (country != "All") {
      filtered = filtered.filter((student) => {
        return student.origin == country;
      });
    }

    if (!degreeFilter.All) {
      const selectedDegrees = getSelected(degreeFilter)
      filtered = filtered.filter((student) => {
        return selectedDegrees.includes(student.degree);
      });
    }

    if (!courseFilter.All) {
      const selectedCourses = getSelected(courseFilter)
      filtered = filtered.filter((student) => {
        return selectedCourses.includes(student.course);
      });
    }

    setFilteredStudents(filtered);
  };

  return (
    <>
      <SearchArea>
        <SearchBar input={searchInput} handleInput={updateInput} />
        <CountryFilter
          countryList={Array.from(countries)}
          handleCountry={updateCountry}
        />
        <CheckboxFilter
          name={"Degree"}
          optionList={Array.from(degrees)}
          handleOptionClick={updateDegreeFilter}
        />
        <CheckboxFilter
          name={"Course"}
          optionList={Array.from(courses)}
          handleOptionClick={updateCourseFilter}
        />
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
  handleInput: PropTypes.func,
};

CountryFilter.propTypes = {
  countryList: PropTypes.array,
  handleCountry: PropTypes.func,
};

CheckboxFilter.propTypes = {
  name: PropTypes.string,
  optionList: PropTypes.array,
  handleOptionClick: PropTypes.func.isRequired,
};
