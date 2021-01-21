import React from 'react';
import PropTypes from 'prop-types';
import { DataGrid, GridOverlay } from '@material-ui/data-grid';
import { withStyles } from '@material-ui/core';

const styles = theme => ({
  root: {
    marginTop: theme.spacing(3),
    overflowX: 'auto',
    width:800
  }
});

const CustomNoRowsOverlay = () => {
  return (
    <GridOverlay>
      <div>Sem investimentos</div>
    </GridOverlay>
  );
}


const SimpleTable = (props) =>
  <DataGrid
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

SimpleTable.propTypes = {
  classes: PropTypes.object.isRequired,
  columns: PropTypes.array.isRequired,
  rows: PropTypes.array.isRequired,
  onSelectionChange: PropTypes.func
};

export default withStyles(styles)(SimpleTable);
