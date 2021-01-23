import { Grid, Typography } from '@material-ui/core';
import React from 'react';
import PropTypes from 'prop-types';
import SpinnerInput from './SpinnerInput';

const SpinnerInputWithLabel = props =>
    <Grid container justify='space-between'> 
      <Grid item>
        <Typography variant='body1'>{props.labelText}</Typography>
      </Grid>
      <Grid item>
        <SpinnerInput 
          defaultValue={props.spinnerDefaultValue} 
          minValue={0}
          maxValue={props.spinnerMaxValue}
          loanId={props.spinnerLoanId}
          isPrice={props.isPrice ? props.isPrice : false}
          disabled={props.disabled ? props.disabled : false}
          onNewValue={props.onNewValue}
        />
      </Grid>
    </Grid>

SpinnerInputWithLabel.propTypes = {
  labelText: PropTypes.string.isRequired,
  spinnerDefaultValue: PropTypes.number.isRequired,
  spinnerMaxValue: PropTypes.number.isRequired,
  spinnerLoanId: PropTypes.number.isRequired,
  defaultValue: PropTypes.number,
  isPrice: PropTypes.bool,
  onNewValue: PropTypes.func,
  disabled: PropTypes.bool
};

export default SpinnerInputWithLabel
