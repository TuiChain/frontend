import { Grid, Typography, TextField } from '@material-ui/core';
import CurrencyTextField from '@unicef/material-ui-currency-textfield';
import React from 'react';
import PropTypes from 'prop-types';
import DAI from './DAI';

const InputWithLabel = ({labelText, defaultValue, isCurrency}) =>
  <Grid container justify='space-between'> 
    <Grid item>
      <Typography variant='body1'>{labelText}</Typography>
    </Grid>
    <Grid item>
      {
        isCurrency
          ? <CurrencyTextField
              style={{width: 100, marginRight: 30}}
              variant="standard"
              value={defaultValue}
              currencySymbol={<DAI />}
              outputFormat="number"
              disabled
            />
          : <TextField
              style={{width: 100, marginRight: 30}}
              variant="standard"
              value={defaultValue}
              disabled
            />
      }
    </Grid>
  </Grid>

InputWithLabel.propTypes = {
  labelText: PropTypes.string.isRequired,
  defaultValue: PropTypes.number.isRequired,
  isCurrency: PropTypes.bool.isRequired
};

export default InputWithLabel
