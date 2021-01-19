import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Grid, IconButton, TextField } from '@material-ui/core';
import RemoveRoundedIcon from '@material-ui/icons/RemoveRounded';
import AddRoundedIcon from '@material-ui/icons/AddRounded';
import CurrencyTextField from '@unicef/material-ui-currency-textfield';
import DAI from './DAI';

const SpinnerInput = (props) => {
  const step = props.step || 1
  const isPrice = props.isPrice || false
  const [value, setValue] = useState(props.defaultValue)
  const [isMinusEnable, setIsMinusEnable] = useState(props.defaultValue !== props.minValue)
  const [isPlusEnable, setIsPlusEnable] = useState(true)

  useEffect(() => {
    setValue(props.defaultValue)
  },[props.loanId])

  const handlePlusClick = () => {
    let nextValue = parseFloat(value + step)

    if(isPrice){
      nextValue = nextValue.toFixed(2)
    }

    if(nextValue >= props.maxValue){
      setIsPlusEnable(false)
      setValue(props.maxValue)
    }
    if(!isMinusEnable){
      setIsMinusEnable(true)
    }

    setValue(parseFloat(nextValue))
  }

  const handleMinusClick = () => {
    let nextValue = value - step

    if(isPrice){
      nextValue = nextValue.toFixed(2)
    }

    if( nextValue <= props.minValue){
      setIsMinusEnable(false)
      setValue(props.minValue)
    }
    if(!isPlusEnable){
      setIsPlusEnable(true)
    }

    setValue(parseFloat(nextValue))
  }

  const onChangeHandler = (event) => {
    const newValue = 
      isPrice ? parseFloat(event.target.value) : parseInt(event.target.value)
    
    if(newValue >= props.maxValue){
      setValue(props.maxValue)
      setIsPlusEnable(false)
      return
    }

    if(newValue <= props.minValue){
      setValue(props.minValue)
      setIsMinusEnable(false)
      return
    }

    setIsPlusEnable(true)
    setIsMinusEnable(true)
    setValue(newValue)
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
          minimumValue={props.minValue}
        />
      )
    }else{
      return(
        <TextField
          style={{width: 100}}
          id="standard-number"
          type="number"
          onChange={(event) => onChangeHandler(event)}
          defaultValue={value}
          value={value}
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
  step: PropTypes.number
};

export default (SpinnerInput);
