import React, { useState, useEffect } from "react";
import LoansService from "../../services/loans.service";
import { Box, Grid, Typography, withWidth, Link } from "@material-ui/core";
import { styled } from "@material-ui/core/styles";
import LoanCard from "../../components/LoanCard";
import theme from "../../theme";
import PropTypes from "prop-types";
import LoadingPageAnimation from "../../components/LoadingPageAnimation";
import FilterSection from "../../components/FilterSection";
import HorizontalSeparator from "../../components/HorizontalSeparator";
import { Link as RouterLink } from "react-router-dom";

const LoansGrid = styled(Grid)({
  paddingTop: "5rem",
  [theme.breakpoints.only("xs")]: {
    paddingLeft: "15%",
    paddingRight: "15%",
  },
});

const LoansGridItem = ({ loanCard, width, loanId }) => {
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
      <Link to={`/loans/${loanId}`} component={RouterLink} underline="none">
        {loanCard}
      </Link>
    </Grid>
  );
};

const MessageContainer = styled(Box)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: 200,
  color: "#6D6E7B",
});

const Message = styled(Typography)({
  flex: "0 0 200px",
});

const FundingLoans = () => {
  const [loans, setLoans] = useState([]);
  const [filteredLoans, setFilteredLoans] = useState([]);
  const [width, setWidth] = useState(window.innerWidth);
  const [fetching, setFetching] = useState(true);

  window.addEventListener("resize", () => {
    setWidth(window.innerWidth);
  });

  const handleFilters = (filteredLoans) => {
    setFilteredLoans(filteredLoans);
  };

  useEffect(() => {
    LoansService.getFundingLoans().then((loanList) => {
      setLoans(loanList);
      setFilteredLoans(loanList);
      setFetching(false);
    });
  }, []);

  return (
    <>
      <Typography variant="h2" paragraph>
        Loans
      </Typography>
      <FilterSection loans={loans} onChange={handleFilters} />
      <HorizontalSeparator />
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
                loanId={l.id}
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
                    fundedPercentage={Number(
                      BigInt(l.funded_value_atto_dai * 100) /
                        BigInt(l.requested_value_atto_dai)
                    )}
                  />
                }
              />
            );
          })}
        </LoansGrid>
      ) : (
        <MessageContainer>
          <Message variant="h6">No results were found</Message>
        </MessageContainer>
      )}
    </>
  );
};

export default withWidth()(FundingLoans);

LoansGridItem.propTypes = {
  loanCard: PropTypes.object,
  width: PropTypes.number,
  loanId: PropTypes.number,
};
