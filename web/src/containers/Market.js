/* eslint react/prop-types: 0 */
import React, { useState, useEffect } from "react";
import LoansService from "../services/loans.service";
import { Box, Typography, Avatar } from "@material-ui/core";
import { styled } from "@material-ui/core/styles";
import LoadingPageAnimation from "../components/LoadingPageAnimation";
import { DataGrid } from "@material-ui/data-grid";
import { useHistory } from "react-router";
import DAI from "../components/DAI";
import HorizontalSeparator from "../components/HorizontalSeparator";
import FilterSection from "../components/FilterSection";

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

const Market = () => {
  const [loans, setLoans] = useState([]);
  const [filteredLoans, setFilteredLoans] = useState([]);
  const [fetching, setFetching] = useState(true);
  const history = useHistory();

  useEffect(() => {
    LoansService.getActiveLoans().then((loanList) => {
      setLoans(loanList);
      setFilteredLoans(loanList);
      setFetching(false);
    });
  }, []);

  const columns = [
    { field: "id", headerName: "ID", hide: true },
    {
      field: "user_full_name",
      headerName: " ",
      // eslint-disable-next-line react/display-name
      renderCell: (props) => (
        <Avatar>{props.row.user_full_name.charAt(0)}</Avatar>
      ),
      width: 70,
    },
    {
      field: "school",
      headerName: "School",
      width: 220,
    },
    {
      field: "course",
      headerName: "Course",
      width: 240,
    },
    {
      field: "destination",
      headerName: "Destination",
      width: 200,
    },
    {
      field: "current_value",
      headerName: "Price",
      // eslint-disable-next-line react/display-name
      renderCell: (props) => (
        <Box display="flex" alignContent="center" alignItems="center" pr={2}>
          {props.row.current_value ? (
            <>
              <Box pr={1}>{props.row.current_value}</Box>
              <DAI />
            </>
          ) : (
            <>-</>
          )}
        </Box>
      ),
    },
    {
      field: "requested_value",
      headerName: "Requested",
      // eslint-disable-next-line react/display-name
      renderCell: (props) => (
        <Box display="flex" alignContent="center" alignItems="center" pr={2}>
          <Box pr={1}>{props.row.requested_value}</Box>
          <DAI />
        </Box>
      ),
    },
  ];

  const handleLoanClick = (element) => {
    const loan = element.row;

    history.push(`/loans/${loan.id}`);
  };

  const handleFilters = (filteredLoans) => {
    setFilteredLoans(filteredLoans);
  };

  return (
    <>
      <Typography variant="h2" paragraph>
        Market
      </Typography>
      <FilterSection loans={loans} onChange={handleFilters} />
      <HorizontalSeparator />
      {fetching ? (
        <Box style={{ height: "50vh" }}>
          <LoadingPageAnimation />
        </Box>
      ) : filteredLoans.length >= 1 ? (
        <DataGrid
          rows={filteredLoans}
          columns={columns}
          pageSize={10}
          autoHeight
          onRowClick={handleLoanClick}
        />
      ) : (
        <Container>
          <SearchMessage variant="h6">No results were found</SearchMessage>
        </Container>
      )}
    </>
  );
};

export default Market;
