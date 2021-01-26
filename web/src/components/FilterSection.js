import React, { useState, useEffect } from "react";
import TuneIcon from "@material-ui/icons/Tune";
import CircleCheckedFilled from "@material-ui/icons/CheckCircle";
import CircleUnchecked from "@material-ui/icons/RadioButtonUnchecked";
import {
  Box,
  Grid,
  Input,
  Select,
  Checkbox,
  FormControlLabel,
  FormControl,
  MenuItem,
  Button,
  withWidth,
} from "@material-ui/core";
import { styled } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import HorizontalSeparator from "./HorizontalSeparator";

const backgroundColor1 = "#EFF0F6";
const backgroundColor2 = "#D7D8E7";

// Helper functions

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

// Common

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
  textAlign: mobile == 1 && "center",
  padding: mobile ? "1rem 15% 1rem 15%" : "0 0 0 0",
}));

// Checkbox filter

const CheckboxFilter = ({ name, status, onChange, parallel, mobile }) => {
  return (
    <FilterBox mobile={mobile}>
      <FilterTitle title={name} mobile={mobile} />
      {mobile == 1 && <HorizontalSeparator color={backgroundColor2} />}
      <Grid style={{ paddingTop: mobile && "1rem" }} container>
        {Object.entries(status).map(
          (option, index) =>
            option[0] != "All" && (
              <Grid
                style={{
                  textAlign: mobile && index % 2 == 0 ? "right" : "left",
                }}
                key={option[0]}
                item
                xs={parallel ? 6 : 12}
              >
                <FormControlLabel
                  labelPlacement={mobile && index % 2 == 0 ? "start" : "end"}
                  key={option[0]}
                  control={
                    <Checkbox
                      checked={option[1]}
                      icon={<StyledCircleUnchecked />}
                      checkedIcon={<CircleCheckedFilled />}
                      color="primary"
                      name={option[0]}
                      onChange={(e) => onChange(e.target.name)}
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

const StyledCircleUnchecked = styled(CircleUnchecked)({
  borderRadius: 100,
  background: backgroundColor2,
});

// Search Bar

const SearchBar = ({ input, onChange, mobile }) => {
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
      placeholder={"Search for a loan..."}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

// Country filter

const CountryFilter = ({ value, countryList, onChange, mobile }) => {
  return (
    <FilterBox mobile={mobile}>
      <FilterTitle title="Country" mobile={mobile} />

      {mobile == 1 && <HorizontalSeparator color={backgroundColor2} />}
      <FormControl style={{ paddingTop: mobile && "1rem" }} variant="outlined">
        <StyledSelect
          onChange={(e) => onChange(e.target.value)}
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

const StyledSelect = styled(Select)({
  background: backgroundColor1,
  borderRadius: 20,
  minWidth: 200,
  "& .MuiOutlinedInput-notchedOutline": {
    borderWidth: "0px",
  },
});

// Main component

const FiltersGrid = styled(Grid)(({ opened }) => ({
  paddingBottom: opened ? "0.3rem" : "2rem",
}));

const SearchBox = styled(Box)(({ mobile }) => ({
  paddingTop: "1rem",
  display: "flex",
  flexDirection: mobile ? "column" : "row",
  alignItems: mobile ? "center" : "flex-start",
  width: "100%",
}));

const DisplayFiltersButton = styled(Button)(({ mobile }) => ({
  flex: mobile ? "0 0 0" : "0 0 155px",
  marginRight: 0,
}));

const ResetButton = styled(Button)({
  width: "155px",
  marginRight: 0,
  marginBottom: 0,
});

const FilterSection = ({ loans, onChange, ...props }) => {
  const [displayFilters, setDisplayFilters] = useState(false);
  const [searchInput, setInput] = useState("");
  const [country, setCountry] = useState("All");
  const [countryList, setCountryList] = useState([]);
  const [schoolFilter, setSchoolFilter] = useState({ All: true });
  const [courseFilter, setCourseFilter] = useState({ All: true });

  const mobile = props.width === "xs" || props.width === "sm" ? 1 : 0;

  useEffect(() => {
    let countries = new Set();
    let schools = new Set();
    let courses = new Set();

    loans.map((l) => {
      countries.add(l.destination);
      courses.add(l.course);
      schools.add(l.school);
    });

    const schoolFilterStatus = buildStatusObject(
      Array.from(schools),
      schoolFilter
    );

    const courseFilterStatus = buildStatusObject(
      Array.from(courses),
      courseFilter
    );

    setCountryList(Array.from(countries));
    setSchoolFilter(schoolFilterStatus);
    setCourseFilter(courseFilterStatus);
  }, [loans]);

  const updateInput = (input) => {
    setInput(input);
    filterLoans(input, country, schoolFilter, courseFilter);
  };

  const updateCountry = (country) => {
    setCountry(country);
    filterLoans(searchInput, country, schoolFilter, courseFilter);
  };

  const updateSchoolFilter = (selectedSchool) => {
    const updatedFilter = updateCheckboxFilter(selectedSchool, schoolFilter);
    setSchoolFilter(updatedFilter);
    filterLoans(searchInput, country, updatedFilter, courseFilter);
  };

  const updateCourseFilter = (selectedCourse) => {
    const updatedFilter = updateCheckboxFilter(selectedCourse, courseFilter);
    setCourseFilter(updatedFilter);
    filterLoans(searchInput, country, schoolFilter, updatedFilter);
  };

  const resetFilters = () => {
    const newSchoolFilter = resetFilter(schoolFilter);
    const newCourseFilter = resetFilter(courseFilter);

    setCountry("All");
    setSchoolFilter(newSchoolFilter);
    setCourseFilter(newCourseFilter);

    filterLoans(searchInput, "All", newSchoolFilter, newCourseFilter);
  };

  const filterLoans = (searchInput, country, schoolFilter, courseFilter) => {
    let filteredLoans = loans;

    if (searchInput != "") {
      filteredLoans = loans.filter((loan) => {
        return loan.user_full_name
          .toLowerCase()
          .includes(searchInput.toLowerCase());
      });
    }

    if (country != "All") {
      filteredLoans = filteredLoans.filter((loan) => {
        return loan.destination == country;
      });
    }

    if (!schoolFilter.All) {
      const selectedSchools = getSelected(schoolFilter);
      filteredLoans = filteredLoans.filter((loan) => {
        return selectedSchools.includes(loan.school);
      });
    }

    if (!courseFilter.All) {
      const selectedCourses = getSelected(courseFilter);

      filteredLoans = filteredLoans.filter((loan) => {
        return selectedCourses.includes(loan.course);
      });
    }

    onChange(filteredLoans);
  };

  return (
    <FiltersGrid
      opened={displayFilters ? 1 : 0}
      container
      justify="space-between"
    >
      <SearchBox mobile={mobile}>
        <SearchBar mobile={mobile} input={searchInput} onChange={updateInput} />
        <DisplayFiltersButton
          mobile={mobile}
          startIcon={<TuneIcon />}
          variant={displayFilters ? "outlined" : "contained"}
          color="primary"
          onClick={() => setDisplayFilters(!displayFilters)}
        >
          {displayFilters ? "Hide Filters" : "Show Filters"}
        </DisplayFiltersButton>
      </SearchBox>
      {displayFilters && (
        <>
          <Grid item xs={12} md={4}>
            <CountryFilter
              mobile={mobile}
              value={country}
              countryList={countryList}
              onChange={updateCountry}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <CheckboxFilter
              mobile={mobile}
              parallel={mobile}
              name={"School"}
              status={schoolFilter}
              onChange={updateSchoolFilter}
            />
          </Grid>
          <Grid item xs={12} md>
            <CheckboxFilter
              mobile={mobile}
              parallel
              name={"Course"}
              status={courseFilter}
              onChange={updateCourseFilter}
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
    </FiltersGrid>
  );
};

export default withWidth()(FilterSection);

FilterSection.propTypes = {
  width: PropTypes.string,
  loans: PropTypes.array,
  onChange: PropTypes.func,
};

SearchBar.propTypes = {
  input: PropTypes.string,
  onChange: PropTypes.func,
  mobile: PropTypes.number,
};

CountryFilter.propTypes = {
  value: PropTypes.string.isRequired,
  countryList: PropTypes.array,
  onChange: PropTypes.func,
  mobile: PropTypes.number,
};

CheckboxFilter.propTypes = {
  name: PropTypes.string,
  status: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  parallel: PropTypes.bool,
  mobile: PropTypes.number,
};

FilterTitle.propTypes = {
  mobile: PropTypes.number,
  title: PropTypes.string.isRequired,
};
