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
      field: "amount",
      headerName: "Amount",
      type: "number",
      width: 110,
    },
    {
      field: "school",
      headerName: "School",
      width: 280,
    },
    {
      field: "course",
      headerName: "Course",
      width: 280,
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
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  };

  const translateTab = (tab) => {
    switch (tab) {
      case 0:
        return "Funding";
      case 1:
        return "Expired";
      case 2:
        return "Canceled";
      case 3:
        return "Active";
      case 4:
        return "Finalized";
      case 5:
        return "Requested";
      case 6:
        return "Rejected";
    }
  };

  // Student Loans
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function fetchLoans() {
      const data = await LoansService.getStudentLoans();
      const groups = groupBy(data, "state");
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
            <Tab label="Funding" /> {/* status=0 */}
            <Tab label="Expired" /> {/* status=1 */}
            <Tab label="Canceled" /> {/* status=2 */}
            <Tab label="Active" /> {/* status=3 */}
            <Tab label="Finalized" /> {/* status=4 */}
            <Tab label="Requested" />
            <Tab label="Rejected" />
          </Tabs>
        </Grid>
        <Grid item xs={12} lg={10}>
          <LoansList loans={loans[translateTab(tab)]} loading={loading} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Loans;
