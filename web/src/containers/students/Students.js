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
  Button,
  withWidth,
} from "@material-ui/core";
import { styled } from "@material-ui/core/styles";
import StudentCard from "../../components/StudentCard";
import theme from "../../theme";
import PropTypes from "prop-types";
import TuneIcon from "@material-ui/icons/Tune";
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

const resetFilter = (obj) => {
  let filter = {};
  filter["All"] = true;

  Object.entries(obj).map((entry) => {
    if (entry[0] !== "All") filter[entry[0]] = false;
  });

  return filter;
};

const getSelected = (obj) => {
  let selected = [];

  for (const [key, value] of Object.entries(obj)) value && selected.push(key);

  return selected;
};

const updateCheckboxFilter = (selectedOption, filterStatus) => {
  let filter = filterStatus;

  filter[selectedOption] = !filter[selectedOption];

  filter = normalizeFilter(filter);
  return filter;
};

const buildStatusObject = (options, filterStatus) => {
  let filter = filterStatus;

  options.map((o) => {
    filter[o] = false;
  });

  return filter;
};

const FilterTitle = ({ title, mobile }) => {
  const BoxStyling = {
    paddingBottom: mobile ? "0.5rem" : "1rem",
  };
  return (
    <Box style={BoxStyling} fontWeight="fontWeightBold">
      {title}
    </Box>
  );
};

const FilterBox = styled(Box)(({ mobile }) => ({
  textAlign: mobile && "center",
  padding: mobile ? "1rem 15% 1rem 15%" : "0 0 0 0",
}));

const StyledCircleUnchecked = styled(CircleUnchecked)({
  borderRadius: 100,
  background: backgroundColor2,
});

const CheckboxFilter = ({
  name,
  status,
  handleOptionClick,
  parallel,
  mobile,
}) => {
  return (
    <FilterBox mobile={mobile}>
      <FilterTitle title={name} mobile={mobile} />
      {mobile && <Separator color={backgroundColor2} />}
      <Grid style={{paddingTop: mobile && "1rem"}} container>
        {Object.entries(status).map(
          (option, index) =>
            option[0] !== "All" && (
              <Grid
                style={{
                  textAlign: mobile && index % 2 === 0 ? "right" : "left",
                }}
                key={option[0]}
                item
                xs={parallel ? 6 : 12}
              >
                <FormControlLabel
                  labelPlacement={mobile && index % 2 === 0 ? "start" : "end"}
                  key={option[0]}
                  control={
                    <Checkbox
                      checked={option[1]}
                      icon={<StyledCircleUnchecked />}
                      checkedIcon={<CircleCheckedFilled />}
                      color="primary"
                      name={option[0]}
                      onChange={(e) => handleOptionClick(e.target.name)}
                    />
                  }
                  label={option}
                />
              </Grid>
            )
        )}
      </Grid>
    </FilterBox>
  );
};

const StudentsGrid = styled(Grid)({
  paddingTop: "5rem",
  [theme.breakpoints.only("xs")]: {
    paddingLeft: "15%",
    paddingRight: "15%",
  },
});

const SearchArea = styled(Grid)(({ opened }) => ({
  paddingBottom: opened ? "0.3rem" : "2rem",
}));

const SearchBar = ({ input, handleInput, mobile }) => {
  const BarStyling = {
    flex: 1,
    background: backgroundColor1,
    padding: "0.7rem",
    borderRadius: 20,
    marginBottom: mobile ? "0" : "2rem",
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

const CountryFilter = ({ value, countryList, handleCountry, mobile }) => {
  return (
    <FilterBox mobile={mobile}>
      <FilterTitle title="Country" mobile={mobile} />
      {mobile && <Separator color={backgroundColor2} />}
      <FormControl style={{paddingTop: mobile && "1rem"}} variant="outlined">
        <StyledSelect
          onChange={(e) => handleCountry(e.target.value)}
          value={value}
          displayEmpty
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
    </FilterBox>
  );
};

const SearchBox = styled(Box)(({ mobile }) => ({
  paddingTop: "1rem",
  display: "flex",
  flexDirection: mobile ? "column" : "row",
  alignItems: mobile ? "center" : "flex-start",
  width: "100%",
}));

const ResetButton = styled(Button)({
  width: "155px",
  marginRight: 0,
  marginBottom: 0,
});

const FilterButton = styled(Button)(({ mobile }) => ({
  flex: mobile ? "0 0 0" : "0 0 155px",
  marginRight: 0,
}));

const Separator = styled(Box)(({ color }) => ({
  border: color ? `0.5px solid ${color}` : "0.5px solid rgba(0,0,0,0.75)",
}));

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

const Students = (props) => {
  const [displayFilters, setDisplayFilters] = useState(false);
  const [searchInput, setInput] = useState("");
  const [country, setCountry] = useState("All");
  const [countryList, setCountryList] = useState([]);
  const [degreeFilter, setDegreeFilter] = useState({ All: true });
  const [courseFilter, setCourseFilter] = useState({ All: true });
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);

  const mobile = props.width === "xs";

  useEffect(() => {
    getStudents().then((studentList) => {
      let countries = new Set();
      let degrees = new Set();
      let courses = new Set();

      studentList.map((s) => {
        countries.add(s.origin);
        degrees.add(s.degree);
        courses.add(s.course);
      });

      const degreeFilterStatus = buildStatusObject(
        Array.from(degrees),
        degreeFilter
      );

      const courseFilterStatus = buildStatusObject(
        Array.from(courses),
        courseFilter
      );

      setCountryList(Array.from(countries));
      setDegreeFilter(degreeFilterStatus);
      setCourseFilter(courseFilterStatus);
      setStudents(studentList);
      setFilteredStudents(studentList);
    });
  }, []);

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

  const resetFilters = () => {
    const newDegreeFilter = resetFilter(degreeFilter);
    const newCourseFilter = resetFilter(courseFilter);

    setCountry("All");
    setDegreeFilter(newDegreeFilter);
    setCourseFilter(newCourseFilter);

    filterStudents(searchInput, "All", newDegreeFilter, newCourseFilter);
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
      console.log("Selected Degrees", selectedDegrees);
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
      <SearchBox mobile={mobile}>
        <SearchBar
          mobile={mobile}
          input={searchInput}
          handleInput={updateInput}
        />
        <FilterButton
          mobile={mobile}
          startIcon={<TuneIcon />}
          variant={displayFilters ? "outlined" : "contained"}
          color="primary"
          onClick={() => setDisplayFilters(!displayFilters)}
        >
          {displayFilters ? "Hide Filters" : "Show Filters"}
        </FilterButton>
      </SearchBox>
      <SearchArea opened={displayFilters} container justify="space-between">
        {displayFilters && (
          <>
            <Grid item xs={12} sm={4}>
              <CountryFilter
                mobile={mobile}
                value={country}
                countryList={countryList}
                handleCountry={updateCountry}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <CheckboxFilter
                mobile={mobile}
                parallel={mobile}
                name={"Degree"}
                status={degreeFilter}
                handleOptionClick={updateDegreeFilter}
              />
            </Grid>
            <Grid item xs={12} sm>
              <CheckboxFilter
                mobile={mobile}
                parallel
                name={"Course"}
                status={courseFilter}
                handleOptionClick={updateCourseFilter}
              />
            </Grid>
            <Grid
              container
              item
              xs={12}
              alignItems="flex-end"
              justify={mobile ? "center" : "flex-end"}
            >
              <Grid item>
                <ResetButton
                  variant="outlined"
                  color="primary"
                  onClick={() => resetFilters()}
                >
                  Clear Filters
                </ResetButton>
              </Grid>
            </Grid>
          </>
        )}
      </SearchArea>
      <Separator />
      {filteredStudents.length >= 1 ? (
        <StudentsGrid
          container
          direction="row"
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

export default withWidth()(Students);

Students.propTypes = {
  width: PropTypes.string,
};

SearchBar.propTypes = {
  input: PropTypes.string,
  handleInput: PropTypes.func,
  mobile: PropTypes.bool,
};

CountryFilter.propTypes = {
  value: PropTypes.string.isRequired,
  countryList: PropTypes.array,
  handleCountry: PropTypes.func,
  mobile: PropTypes.bool,
};

CheckboxFilter.propTypes = {
  name: PropTypes.string,
  status: PropTypes.object,
  handleOptionClick: PropTypes.func.isRequired,
  parallel: PropTypes.bool,
  mobile: PropTypes.bool,
};

FilterTitle.propTypes = {
  mobile: PropTypes.bool,
  title: PropTypes.string.isRequired,
};
