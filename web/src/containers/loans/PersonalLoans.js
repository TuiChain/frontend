/* eslint-disable no-unused-vars */
/* eslint react/prop-types: 0 */

import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";
import {
  Tabs,
  Tab,
  Typography,
  Grid,
  Box,
  useMediaQuery,
  withWidth,
} from "@material-ui/core";
import { DataGrid, GridOverlay } from "@material-ui/data-grid";
import LoansService from "../../services/loans.service";
import DAI from "../../components/DAI";

const NoRowOverlay = () => {
  return (
    <GridOverlay>
      <span>No loans matching your criteria</span>
    </GridOverlay>
  );
};

function LoansList({ loans, loading }) {
  const history = useHistory();

  loans = loans ? loans : [];

  const handleRowClick = (rowParams) => {
    const id = rowParams.row.id;
    history.push(`/personal/loans/${id}`);
  };

  const columns = [
    { field: "id", headerName: "ID" },
    {
      field: "request_date",
      headerName: "Request Date",
      valueGetter: (params) =>
        new Date(params.row.request_date).toLocaleString(),
      width: 210,
    },
    {
      field: "destination",
      headerName: "Country",
      width: 110,
    },
    {
      field: "school",
      headerName: "School",
      width: 240,
    },
    {
      field: "course",
      headerName: "Course",
      width: 240,
    },
    {
      field: "requested_value",
      headerName: "Requested",
      width: 170,
      // eslint-disable-next-line react/display-name
      renderCell: (props) => {
        return (
          <Box display="flex" alignItems="center">
            <Box paddingRight={1}>{props.value}</Box>
            <DAI size={16} />
          </Box>
        );
      },
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        height: 300,
        width: "100%",
        flexGrow: 1,
      }}
    >
      <DataGrid
        rows={loans}
        columns={columns}
        pageSize={5}
        loading={loading}
        onRowClick={handleRowClick}
        autoHeight
        components={{
          noRowsOverlay: NoRowOverlay,
        }}
      />
    </div>
  );
}

const Loans = () => {
  const [tab, setTab] = useState(0);
  const [loans, setLoans] = useState({});

  const orientation = useMediaQuery("(min-width:1280px)", { noSsr: true })
    ? "vertical"
    : "horizontal";

  const handleChange = (event, value) => {
    setTab(value);
  };

  const groupBy = (xs, key) => {
    return xs.reduce(function (rv, x) {
      (rv[x[key].toUpperCase()] = rv[x[key].toUpperCase()] || []).push(x);
      return rv;
    }, {});
  };

  const getTabSize = (tab) => {
    return loans[tab] ? loans[tab].length : 0;
  };

  const getTabState = (tab) => {
    switch (tab) {
      case 0:
        return "ALL";
      case 1:
        return "PENDING";
      case 2:
        return "WITHDRAWN";
      case 3:
        return "REJECTED";
      case 4:
        return "FUNDING";
      case 5:
        return "CANCELED";
      case 6:
        return "EXPIRED";
      case 7:
        return "ACTIVE";
      case 8:
        return "FINALIZED";
    }
  };

  // Student Loans
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function fetchLoans() {
      const data = await LoansService.getStudentLoans();
      const groups = groupBy(data, "state");
      groups["ALL"] = data;
      console.log("Groups", groups);
      setLoans(groups);
      setLoading(false);
    }
    fetchLoans();
  }, []);

  return (
    <Box>
      <Typography variant="h2" paragraph>
        Loans
      </Typography>
      <Grid container>
        <Grid item xs={12} lg={2}>
          <Tabs
            orientation={orientation}
            variant="scrollable"
            value={tab}
            onChange={handleChange}
            aria-label="Vertical tabs example"
          >
            <Tab label={"All (" + getTabSize("ALL") + ")"} />
            <Tab label={"Pending (" + getTabSize("PENDING") + ")"} />
            <Tab label={"Withdrawn (" + getTabSize("WITHDRAWN") + ")"} />
            <Tab label={"Rejected (" + getTabSize("REJECTED") + ")"} />
            <Tab label={"Funding (" + getTabSize("FUNDING") + ")"} />
            <Tab label={"Canceled (" + getTabSize("CANCELED") + ")"} />
            <Tab label={"Expired (" + getTabSize("EXPIRED") + ")"} />
            <Tab label={"Active (" + getTabSize("ACTIVE") + ")"} />
            <Tab label={"Finalized (" + getTabSize("FINALIZED") + ")"} />
          </Tabs>
        </Grid>
        <Grid item xs={12} lg={10}>
          <LoansList loans={loans[getTabState(tab)]} loading={loading} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Loans;
