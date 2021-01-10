import React, { useState, useEffect } from "react";
import getStudents from "../../services/students.service";
import {
  Box,
  Grid,
  Input,
  Select,
  Checkbox,
  FormControlLabel,
  FormControl,
  MenuItem,
  Typography,
} from "@material-ui/core";
import { styled } from "@material-ui/core/styles";
import StudentCard from "../../components/StudentCard";
import theme from "../../theme";
import PropTypes from "prop-types";

const normalizeFilter = (obj) => {
  let allFlag = true;

  for (const [key, value] of Object.entries(obj))
    if (key !== "All" && value) allFlag = false;

  obj.All = allFlag;

  return obj;
};

const getSelected = (obj) => {
  let selected = [];

  for (const [key, value] of Object.entries(obj)) value && selected.push(key);

  console.log(selected);

  return selected;
};

const updateCheckboxFilter = (selectedOption, filterStatus) => {
  let filter = {};
  filter = filterStatus;
  if (!(selectedOption in filterStatus)) filter[selectedOption] = true;
  else filter[selectedOption] = !filter[selectedOption];

  filter = normalizeFilter(filter);
  return filter;
};

const FilterTitle = ({ title }) => {
  return (
    <Box style={{ paddingBottom: "1rem" }} fontWeight="fontWeightBold">
      {title}
    </Box>
  );
};

const CheckboxFilter = ({ name, optionList, handleOptionClick }) => {
  return (
    <>
      <FilterTitle title={name} />
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

const StudentsGrid = styled(Grid)({
  [theme.breakpoints.only("xs")]: {
    paddingLeft: "15%",
    paddingRight: "15%",
  },
});

const SearchArea = styled(Grid)({
  paddingBottom: "2rem",
  paddingTop: "1rem",
});

const SearchBar = ({ input, handleInput }) => {
  const BarStyling = {
    background: "#EFF0F6",
    padding: "0.7rem",
    borderRadius: 20,
    marginBottom: "2rem",
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

const StyledSelect = styled(Select)({
  background: "#EFF0F6",
  borderRadius: 20,
  minWidth: 200,
});

const CountryFilter = ({ value, countryList, handleCountry }) => {
  return (
    <>
      <FilterTitle title="Country" />
      <FormControl variant="outlined">
        <StyledSelect
          onChange={(e) => handleCountry(e.target.value)}
          value={value}
          displayEmpty
          inputProps={{ "aria-label": "Without label" }}
        >
          <MenuItem value="All">
            <em>All</em>
          </MenuItem>
          {countryList.map((country) => (
            <MenuItem key={country} value={country}>
              {country}
            </MenuItem>
          ))}
        </StyledSelect>
      </FormControl>
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
    const updatedFilter = updateCheckboxFilter(selectedDegree, degreeFilter);
    setDegreeFilter(updatedFilter);
    filterStudents(searchInput, country, updatedFilter, courseFilter);
  };

  const updateCourseFilter = (selectedCourse) => {
    const updatedFilter = updateCheckboxFilter(selectedCourse, courseFilter);
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
      const selectedDegrees = getSelected(degreeFilter);
      filtered = filtered.filter((student) => {
        return selectedDegrees.includes(student.degree);
      });
    }

    if (!courseFilter.All) {
      const selectedCourses = getSelected(courseFilter);
      filtered = filtered.filter((student) => {
        return selectedCourses.includes(student.course);
      });
    }

    setFilteredStudents(filtered);
  };

  return (
    <>
      <Typography variant="h2" paragraph>
        Students
      </Typography>
      <SearchArea>
        <SearchBar input={searchInput} handleInput={updateInput} />
        <CountryFilter
          value={country}
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
              <Grid key={id} item xs={12} sm={6} md={4} xl={3}>
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
  value: PropTypes.string.isRequired,
  countryList: PropTypes.array,
  handleCountry: PropTypes.func,
};

CheckboxFilter.propTypes = {
  name: PropTypes.string,
  optionList: PropTypes.array,
  handleOptionClick: PropTypes.func.isRequired,
};

FilterTitle.propTypes = {
  title: PropTypes.string.isRequired,
};
