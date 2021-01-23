import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Grid, IconButton, TextField } from '@material-ui/core';
import RemoveRoundedIcon from '@material-ui/icons/RemoveRounded';
import AddRoundedIcon from '@material-ui/icons/AddRounded';
import CurrencyTextField from '@unicef/material-ui-currency-textfield';
import DAI from './DAI';

const SpinnerInput = (props) => {
  const step = props.isPrice ? 0.2 : 1
  const isPrice = props.isPrice || false
  const [value, setValue] = useState(props.defaultValue)
  const [isMinusEnable, setIsMinusEnable] = useState(props.defaultValue !== props.minValue)
  const [isPlusEnable, setIsPlusEnable] = useState(true)

  const handlePlusClick = () => {
    let nextValue = parseFloat(value + step)

    if(isPrice){
      console.log(nextValue, value, step)
      nextValue = parseFloat(nextValue.toFixed(2))
    }
    
    if(nextValue >= props.maxValue){
      setIsPlusEnable(false)
      nextValue = props.maxValue
    }

    if(!isMinusEnable){
      setIsMinusEnable(true)
    }

    console.log(nextValue)
    setValue(nextValue)
    props.onNewValue(nextValue)
  }

  const handleMinusClick = () => {
    let nextValue = parseFloat(value - step)

    if(isPrice){
      parseFloat(nextValue.toFixed(2))
    }

    if( nextValue <= props.minValue){
      setIsMinusEnable(false)
      nextValue = props.minValue
    } 
    
    if(!isPlusEnable){
      setIsPlusEnable(true)
    }
    
    setValue(parseFloat(nextValue))
    if (props.onNewValue) {
      props.onNewValue(nextValue)
    }
  }

  const onChangeHandler = (event) => {
    const newValue = 
      isPrice ? parseFloat(event.target.value) : parseInt(event.target.value)
    
    if(newValue >= props.maxValue){
      setValue(props.maxValue)
      setIsPlusEnable(false)
      if (props.onNewValue) {
        props.onNewValue(newValue)
      }
      return
    }

    if(newValue <= props.minValue){
      setValue(props.minValue)
      setIsMinusEnable(false)
      if (props.onNewValue) {
        props.onNewValue(newValue)
      }
      return
    }

    setIsPlusEnable(true)
    setIsMinusEnable(true)
    setValue(newValue)
    
    if (props.onNewValue) {
      props.onNewValue(newValue)
    }
  }

  const renderTextField = () =>{
    if(isPrice){
      return(
        <CurrencyTextField
          style={{width: 100}}
          variant="standard"
          value={value}
          currencySymbol={<DAI />}
          outputFormat="number"
          onChange={(event, value)=> setValue(value)}
          minimumValue={props.minValue.toString()}
          disabled={props.disabled}
        />
      )
    }else{
      return(
        <TextField
          style={{width: 100}}
          id="standard-number"
          type="number"
          onChange={(event) => onChangeHandler(event)}
          value={value}
          disabled={props.disabled}
        />
      )
    }
  }
  
  return (
    <Grid container>
      <Grid item >
        <IconButton disabled={!isMinusEnable} onClick={handleMinusClick} size='small'>
          <RemoveRoundedIcon />
        </IconButton>
      </Grid>
      <Grid item >
        {renderTextField()}
      </Grid>
      <Grid item >
        <IconButton disabled={!isPlusEnable} onClick={handlePlusClick} size='small'>
          <AddRoundedIcon />
        </IconButton>
      </Grid>
    </Grid>
  );
}

SpinnerInput.propTypes = {
  loanId: PropTypes.number,
  defaultValue: PropTypes.number,
  maxValue: PropTypes.number,
  minValue: PropTypes.number,
  isPrice: PropTypes.bool,
  step: PropTypes.number,
  disabled: PropTypes.bool,
  onNewValue: PropTypes.func,
};

export default (SpinnerInput);
