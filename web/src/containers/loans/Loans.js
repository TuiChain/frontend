/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";
import { Tabs, Tab, Box, Typography, makeStyles } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";

function TabPanel(props) {
  const { value, index, list } = props;
  const history = useHistory();
  const classes = makeStyles(() => ({
    test: {
      width: 100,
      height: 100,
    },
  }));
  const handleRowClick = (rowParams) => {
    const id = rowParams.row.id;
    history.push(`/loans/${id}`);
  };

  const columns = [{ field: "id", headerName: "ID", width: "20%" }];

  return (
    <div
      style={{ height: 400, width: "100%" }}
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      className={classes.test}
    >
      <div style={{ width: "100%", height: "100%" }}>
        <DataGrid
          rows={list}
          columns={columns}
          pageSize={5}
          onRowClick={handleRowClick}
          autoHeight
        />
      </div>
    </div>
  );
}

TabPanel.propTypes = {
  list: PropTypes.array.isRequired,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const Loans = (props) => {
  console.log(props);
  const [value, setValue] = useState(0);
  const [orientation] = useState("vertical");
  //const xs_screen = useMediaQuery("(max-width:600px)");
  //xs_screen ? setOrientation("horizontal") : setOrientation("vertical");
  //console.log(xs_screen);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Typography variant="h2" paragraph>
        Loans
      </Typography>
      <Box style={{ display: "flex" }}>
        <Tabs
          orientation={orientation}
          variant="scrollable"
          value={value}
          onChange={handleChange}
          aria-label="Vertical tabs example"
        >
          <Tab label="In progress" {...a11yProps(0)} />
          <Tab label="Rejected" {...a11yProps(1)} />
          <Tab label="Canceled" {...a11yProps(2)} />
        </Tabs>
        <TabPanel value={value} index={0} list={[{ id: 0 }, { id: 1 }]} />
        <TabPanel value={value} index={1} list={[{ id: 3 }, { id: 4 }]} />
        <TabPanel value={value} index={2} list={[{ id: 5 }, { id: 6 }]} />
      </Box>
    </>
  );
};

export default Loans;
