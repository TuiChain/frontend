import React, { useState, useEffect } from "react";
import LoansService from "../../services/loans.service";
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
  Link,
} from "@material-ui/core";
import { styled } from "@material-ui/core/styles";
import LoanCard from "../../components/StudentCard";
import theme from "../../theme";
import PropTypes from "prop-types";
import TuneIcon from "@material-ui/icons/Tune";
import CircleCheckedFilled from "@material-ui/icons/CheckCircle";
import CircleUnchecked from "@material-ui/icons/RadioButtonUnchecked";
import LoadingPageAnimation from "../../components/LoadingPageAnimation";

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
    <FilterBox mobile={mobile.toString()}>
      <FilterTitle title={name} mobile={mobile} />
      {mobile && <Separator color={backgroundColor2} />}
      <Grid style={{ paddingTop: mobile && "1rem" }} container>
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

const LoansGrid = styled(Grid)({
  paddingTop: "5rem",
  [theme.breakpoints.only("xs")]: {
    paddingLeft: "15%",
    paddingRight: "15%",
  },
});

const LoansGridItem = ({ loanCard, width, loan_id }) => {
  const slim = width > 600 && width < 700;
  return (
    <Grid
      style={{ paddingLeft: slim && "6rem", paddingRight: slim && "6rem" }}
      item
      xs={12}
      sm={width < 700 ? 12 : 6}
      md={width < 1060 ? 6 : 4}
      xl={3}
    >
      <Link href={`/loans/${loan_id}`} underline="none">
        {loanCard}
      </Link>
    </Grid>
  );
};

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
      placeholder={"Search for a loan..."}
      onChange={(e) => handleInput(e.target.value)}
    />
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

const CountryFilter = ({ value, countryList, handleCountry, mobile }) => {
  return (
    <FilterBox mobile={mobile}>
      <FilterTitle title="Country" mobile={mobile} />
      {mobile && <Separator color={backgroundColor2} />}
      <FormControl style={{ paddingTop: mobile && "1rem" }} variant="outlined">
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

const FundingLoans = (props) => {
  const [displayFilters, setDisplayFilters] = useState(false);
  const [searchInput, setInput] = useState("");
  const [country, setCountry] = useState("All");
  const [countryList, setCountryList] = useState([]);
  const [schoolFilter, setSchoolFilter] = useState({ All: true });
  const [courseFilter, setCourseFilter] = useState({ All: true });
  const [loans, setLoans] = useState([]);
  const [filteredLoans, setFilteredLoans] = useState([]);
  const [width, setWidth] = useState(window.innerWidth);
  const [fetching, setFetching] = useState(true);

  const mobile = props.width === "xs" || props.width === "sm";

  window.addEventListener("resize", () => {
    setWidth(window.innerWidth);
  });

  useEffect(() => {
    LoansService.getFundingLoans().then((loanList) => {
      let countries = new Set();
      let schools = new Set();
      let courses = new Set();

      loanList.map((l) => {
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
      setLoans(loanList);
      setFilteredLoans(loanList);
      setFetching(false);
    });
  }, []);

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
    let filtered = loans;

    if (searchInput != "") {
      filtered = loans.filter((loan) => {
        return loan.user_full_name
          .toLowerCase()
          .includes(searchInput.toLowerCase());
      });
    }

    if (country != "All") {
      filtered = filtered.filter((loan) => {
        return loan.destination == country;
      });
    }

    if (!schoolFilter.All) {
      const selectedSchools = getSelected(schoolFilter);
      filtered = filtered.filter((loan) => {
        return selectedSchools.includes(loan.school);
      });
    }

    if (!courseFilter.All) {
      const selectedCourses = getSelected(courseFilter);

      filtered = filtered.filter((loan) => {
        return selectedCourses.includes(loan.course);
      });
    }

    setFilteredLoans(filtered);
  };

  return (
    <>
      <Typography variant="h2" paragraph>
        Loans
      </Typography>
      <SearchBox mobile={mobile.toString()}>
        <SearchBar
          mobile={mobile}
          input={searchInput}
          handleInput={updateInput}
        />
        <FilterButton
          mobile={mobile.toString()}
          startIcon={<TuneIcon />}
          variant={displayFilters ? "outlined" : "contained"}
          color="primary"
          onClick={() => setDisplayFilters(!displayFilters)}
        >
          {displayFilters ? "Hide Filters" : "Show Filters"}
        </FilterButton>
      </SearchBox>
      <SearchArea
        opened={displayFilters.toString()}
        container
        justify="space-between"
      >
        {displayFilters && (
          <>
            <Grid item xs={12} md={4}>
              <CountryFilter
                mobile={mobile}
                value={country}
                countryList={countryList}
                handleCountry={updateCountry}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <CheckboxFilter
                mobile={mobile}
                parallel={mobile}
                name={"School"}
                status={schoolFilter}
                handleOptionClick={updateSchoolFilter}
              />
            </Grid>
            <Grid item xs={12} md>
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
      {fetching ? (
        <Box style={{ height: "50vh" }}>
          <LoadingPageAnimation />
        </Box>
      ) : filteredLoans.length >= 1 ? (
        <LoansGrid container direction="row" alignItems="center" spacing={10}>
          {filteredLoans.map((l) => {
            return (
              <LoansGridItem
                key={l.id}
                width={width}
                loan_id={l.id}
                loanCard={
                  <LoanCard
                    name={l.user_full_name}
                    photo={l.photo}
                    school={l.school}
                    course={l.course}
                    destination={l.destination}
                    tuition={Number(
                      BigInt(l.requested_value_atto_dai) / BigInt(10 ** 18)
                    )}
                  />
                }
              />
            );
          })}
        </LoansGrid>
      ) : (
        <Container>
          <SearchMessage variant="h6">No results were found</SearchMessage>
        </Container>
      )}
    </>
  );
};

export default withWidth()(FundingLoans);

FundingLoans.propTypes = {
  width: PropTypes.string,
};

LoansGridItem.propTypes = {
  loanCard: PropTypes.object,
  width: PropTypes.number,
  loan_id: PropTypes.number,
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
