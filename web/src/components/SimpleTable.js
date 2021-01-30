import React from "react";
import PropTypes from "prop-types";
import { DataGrid, GridOverlay } from "@material-ui/data-grid";
import { withStyles } from "@material-ui/core";

const styles = (theme) => ({
  root: {
    marginTop: theme.spacing(3),
    overflowX: "auto",
    width: 800,
  },
});

const CustomNoRowsOverlay = () => {
  return (
    <GridOverlay>
      <div>No investments...</div>
    </GridOverlay>
  );
};

const SimpleTable = (props) => (
  <DataGrid
    // headerHeight={63}
    rows={props.rows}
    columns={props.columns}
    pageSize={10}
    hideFooterSelectedRowCount
    autoHeight
    onSelectionChange={props.onSelectionChange}
    components={{
      noRowsOverlay: CustomNoRowsOverlay,
    }}
  />
);

SimpleTable.propTypes = {
  classes: PropTypes.object.isRequired,
  columns: PropTypes.array.isRequired,
  rows: PropTypes.array.isRequired,
<<<<<<< HEAD
  onSelectionChange: PropTypes.func
=======
  onSelectionChange: PropTypes.func,
>>>>>>> fa0f09397cc86e0e64e2a7cd1be20fe5bb4e34a5
};

export default withStyles(styles)(SimpleTable);
