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
import CircleCheckedFilled from "@material-ui/icons/CheckCircle";
import CircleUnchecked from "@material-ui/icons/RadioButtonUnchecked";

const backgroundColor1 = "#EFF0F6";
const backgroundColor2 = "#D7D8E7";

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

const StyledCircleUnchecked = styled(CircleUnchecked)({
  borderRadius: 100,
  background: backgroundColor2,
});

const CheckboxFilter = ({ name, optionList, handleOptionClick, parallel }) => {
  return (
    <>
      <FilterTitle title={name} />
      <Grid style={{ width: "100%" }} container>
        {optionList.map((degree) => (
          <Grid key={degree} item xs={parallel ? 6 : 12}>
            <FormControlLabel
              key={degree}
              control={
                <Checkbox
                  icon={<StyledCircleUnchecked />}
                  checkedIcon={<CircleCheckedFilled />}
                  color="primary"
                  name={degree}
                  onChange={(e) => handleOptionClick(e.target.name)}
                />
              }
              label={degree}
            />
          </Grid>
        ))}
        <Grid item xs={parallel ? 6 : 12}>
          <FormControlLabel
            control={
              <Checkbox
                icon={<StyledCircleUnchecked />}
                checkedIcon={<CircleCheckedFilled />}
                color="primary"
                name="teste"
                onChange={(e) => handleOptionClick(e.target.name)}
              />
            }
            label="teste"
          />
        </Grid>
        <Grid item xs={parallel ? 6 : 12}>
          <FormControlLabel
            control={
              <Checkbox
                icon={<StyledCircleUnchecked />}
                checkedIcon={<CircleCheckedFilled />}
                color="primary"
                name="teste2"
                onChange={(e) => handleOptionClick(e.target.name)}
              />
            }
            label="teste2"
          />
        </Grid>
      </Grid>
    </>
  );
};

const StudentsGrid = styled(Grid)({
  paddingTop: "5rem",
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
    background: backgroundColor1,
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
  background: backgroundColor1,
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

const Separator = styled(Box)({
  border: "0.5px solid rgba(0,0,0,0.75)",
});

const Container = styled(Box)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: 200,
  color: "#6D6E7B",
});

const SearchMessage = styled(Typography)({
  flex: "0 0 200px",
});

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
      <SearchArea container>
        <Grid item xs={12}>
          <SearchBar input={searchInput} handleInput={updateInput} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <CountryFilter
            value={country}
            countryList={Array.from(countries)}
            handleCountry={updateCountry}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <CheckboxFilter
            name={"Degree"}
            optionList={Array.from(degrees)}
            handleOptionClick={updateDegreeFilter}
          />
        </Grid>
        <Grid item xs={12} sm>
          <CheckboxFilter
            parallel
            name={"Course"}
            optionList={Array.from(courses)}
            handleOptionClick={updateCourseFilter}
          />
        </Grid>
      </SearchArea>
      <Separator />
      {filteredStudents.length > 1 ? (
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
      ) : (
        <Container>
          <SearchMessage variant="h6">No results were found</SearchMessage>
        </Container>
      )}
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
  parallel: PropTypes.bool,
};

FilterTitle.propTypes = {
  title: PropTypes.string.isRequired,
};
