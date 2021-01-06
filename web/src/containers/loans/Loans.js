/* eslint-disable no-unused-vars */
/* eslint react/prop-types: 0 */

import React, { useState } from "react";
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
import { DataGrid } from "@material-ui/data-grid";

function LoansList(props) {
  const { loans } = props;
  const history = useHistory();

  const handleRowClick = (rowParams) => {
    const id = rowParams.row.id;
    history.push(`/loans/${id}`);
  };

  const columns = [{ field: "id", headerName: "ID" }];

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
        onRowClick={handleRowClick}
        autoHeight
      />
    </div>
  );
}

const Loans = () => {
  const [tab, setTab] = useState(0);
  const [selected, setSelected] = useState([]);
  const [requested, setRequested] = useState([{ id: 2 }, { id: 3 }]);
  const [funding, setFunding] = useState([{ id: 4 }, { id: 5 }]);
  const [active, setActive] = useState([{ id: 6 }, { id: 7 }]);
  const [rejected, setRejected] = useState([{ id: 8 }, { id: 9 }]);
  const [canceled, setCanceled] = useState([{ id: 10 }, { id: 11 }]);
  const [expired, setExpired] = useState([{ id: 12 }, { id: 13 }]);
  const [finalized, setFinalized] = useState([{ id: 41 }, { id: 15 }]);

  const orientation = useMediaQuery("(min-width:1280px)", { noSsr: true })
    ? "vertical"
    : "horizontal";

  const handleChange = (event, value) => {
    setTab(value);
    switch (value) {
      case 0:
        setSelected(requested);
        break;
      case 1:
        setSelected(funding);
        break;
      case 2:
        setSelected(active);
        break;
      case 3:
        setSelected(rejected);
        break;
      case 4:
        setSelected(canceled);
        break;
      case 5:
        setSelected(expired);
        break;
      case 6:
        setSelected(finalized);
        break;
    }
  };

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
            <Tab label="Requested" />
            <Tab label="Funding" />
            <Tab label="Active" />
            <Tab label="Rejected" />
            <Tab label="Canceled" />
            <Tab label="Expired" />
            <Tab label="Finalized" />
          </Tabs>
        </Grid>
        <Grid item xs={12} lg={10}>
          <LoansList loans={selected} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Loans;
