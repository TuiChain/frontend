/* eslint-disable no-unused-vars */
/* eslint react/prop-types: 0 */

import React, { useState } from "react";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";
import { Tabs, Tab, Typography, Grid, Box } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";

function LoansList(props) {
  const { loans } = props;
  const history = useHistory();

  const handleRowClick = (rowParams) => {
    const id = rowParams.row.id;
    history.push(`/loans/${id}`);
  };

  const columns = [{ field: "id", headerName: "ID", width: "20%" }];

  return (
    <div
      style={{
        display: "flex",
        height: 300,
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

const Loans = (props) => {
  console.log(props);
  const [value, setValue] = useState(0);
  const [active, setActive] = useState([{ id: 0 }, { id: 1 }]);
  const [orientation] = useState("vertical");

  const handleChange = (event, newValue) => {
    console.log(event, newValue);
    setValue(newValue);
  };

  return (
    <Box>
      <Typography variant="h2" paragraph>
        Loans
      </Typography>
      <Grid container>
        <Grid item xs={2}>
          <Tabs
            orientation={orientation}
            variant="scrollable"
            value={value}
            onChange={handleChange}
            aria-label="Vertical tabs example"
          >
            <Tab label="In progress" />
            <Tab label="Rejected" />
            <Tab label="Canceled" />
          </Tabs>
        </Grid>
        <Grid item xs={10}>
          <LoansList loans={active} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Loans;
