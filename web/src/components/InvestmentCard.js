import React from 'react';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { Button, CardHeader, Grid, makeStyles, TextField, Typography } from '@material-ui/core';
import theme from '../theme';
import SpinnerInput from './SpinnerInput';
import CurrencyTextField from '@unicef/material-ui-currency-textfield';
import DAI from './DAI';
import Status from './Status';

const useStyles = makeStyles({
  root: {
    '& .MuiTypography-body1': {
      fontSize: 20,
      fontWeight: 300
    },
    '& [type=number]': {
      '-moz-appearance': 'textfield',
      textAlign: 'right'
    },
    '& .MuiInput-input': {
      '-moz-appearance': 'textfield',
      textAlign: 'right'
    },
    '& ::-webkit-outer-spin-button': {
      '-webkit-appearance': 'none',
      margin: 0,
    },
    '& ::-webkit-inner-spin-button': {
      '-webkit-appearance': 'none',
      margin: 0,
    },
  },
  headers: {
    backgroundColor: theme.palette.secondary.main, 
    color: theme.palette.primary.contrastText
  },
  chip: {
    width: 100,
    color: theme.palette.primary.contrastText,
  }

});

const copy = {
  'active': {
    titleText: "List your tokens in the marketplace",
    buttonText: "List"
  },
  'funding':{
    titleText: "Cancel your funding",
    buttonText: "Cancel"
  },
  'finalized':{
    titleText: "Reedem your tokens",
    buttonText: "Redeem"
  },
  'expired':{
    titleText: "Cash out your tokens",
    buttonText: "Cash out"
  }

}

const investmentCardHeader = (classes, phase, loanName) =>
  <CardHeader
    className={classes.headers}
    action={
      <Status state={phase} />
    }
    title={loanName}
  />

const SpinnerInputWithLabel = ({labelText, spinnerDefaultValue, spinnerMaxValue, spinnerLoanId, isPrice, disabled}) =>
  <Grid container justify='space-between'> 
    <Grid item>
      <Typography variant='body1'>{labelText}</Typography>
    </Grid>
    <Grid item>
      <SpinnerInput 
        defaultValue={spinnerDefaultValue} 
        minValue={0}
        maxValue={spinnerMaxValue}
        loanId={spinnerLoanId}
        isPrice={isPrice ? isPrice : false}
        disabled={disabled ? disabled : false}
      />
    </Grid>
  </Grid>

const CurrencyInputWithLabel = ({labelText, defaultValue}) =>
  <Grid container justify='space-between'> 
    <Grid item>
      <Typography variant='body1'>{labelText}</Typography>
    </Grid>
    <Grid item>
      <CurrencyTextField
        style={{width: 100, marginRight: 30}}
        variant="standard"
        value={defaultValue}
        currencySymbol={<DAI />}
        outputFormat="number"
        disabled
      />
    </Grid>
  </Grid>

const InputWithLabel = ({labelText, defaultValue}) =>
<Grid container justify='space-between'> 
  <Grid item>
    <Typography variant='body1'>{labelText}</Typography>
  </Grid>
  <Grid item>
    <TextField
      style={{width: 100, marginRight: 30}}
      variant="standard"
      value={defaultValue}
      disabled
    />
  </Grid>
</Grid>

const activePhaseInputContent = (props) =>
  <Grid style={{height: 80}} container direction='column' justify='space-between'>
    <Grid container justify='space-between'> 
      <SpinnerInputWithLabel
        labelText="Quantity:"
        spinnerDefaultValue={props.inMarketplace}
        spinnerMaxValue={props.tokens}
        spinnerLoanId={props.loanId}
      />
    </Grid>
    <Grid container justify='space-between'>
      <SpinnerInputWithLabel
        labelText="Price:"
        spinnerDefaultValue={props.inMarketplace}
        spinnerMaxValue={props.tokens}
        spinnerLoanId={props.loanId}
        isPrice={true }
      />
    </Grid>  
  </Grid>
    
const finalizedPhaseInputContent = (props) =>
  <Grid style={{height: 80}} container direction='column' justify='space-between'>
    <InputWithLabel
      labelText="Quantity:"
      defaultValue={props.tokens}
    />
    <CurrencyInputWithLabel
      labelText="Price:"
      defaultValue={props.tokens}
    />  
  </Grid>
    

const fundingPhaseInputContent = (props) =>
  <Grid style={{height: 80}} container direction='column' justify='space-between'>
    <InputWithLabel
      labelText="Quantity:"
      defaultValue={props.tokens}
    />  
    <CurrencyInputWithLabel
      labelText="Payback:"
      defaultValue={props.tokens}
    />  
  </Grid>

const expiredPhaseInputContent = (props) =>
<Grid style={{height: 80}} container direction='column' justify='space-between'>
  <InputWithLabel
    labelText="Quantity:"
    defaultValue={props.tokens}
  />  
  <CurrencyInputWithLabel
    labelText="Payback:"
    defaultValue={props.tokens}
  />  
</Grid>

const renderPhaseInputContent = props => {
  switch(props.phase) {
    case 'active':
      return activePhaseInputContent(props)
    case 'funding':
      return fundingPhaseInputContent(props)
    case 'finalized':
      return finalizedPhaseInputContent(props)
    case 'expired':
      return expiredPhaseInputContent(props)
  }
}

const renderPhaseContent = props => {
  return (
  <CardContent>
  <Grid style={{height: 250}} container direction='column' justify='space-between'>
    <Grid item>
      <Typography variant='h6'>
        {copy[props.phase].titleText}
      </Typography>
    </Grid>
    <Grid style={{height: 80}} container direction='column' justify='space-between'>
      {renderPhaseInputContent(props)}
    </Grid>
    <Grid container justify='flex-end'>
      <Grid item>
        <Button style={{alignSelf: 'flex-end', width: 120}} variant="contained" size="medium" color="primary">
          {copy[props.phase].buttonText}
        </Button>
      </Grid>
    </Grid>
  </Grid>
  </CardContent>)
}

const InvestmentCard = props => {
  const classes = useStyles()
  
  return (
    <Card className={classes.root}>
      {investmentCardHeader(classes, props.phase, props.loanName)}
      {renderPhaseContent(props)}
    </Card>
  );
}

InputWithLabel.propTypes = {
  labelText: PropTypes.string.isRequired,
  defaultValue: PropTypes.number.isRequired
};

CurrencyInputWithLabel.propTypes = {
  labelText: PropTypes.string.isRequired,
  defaultValue: PropTypes.number.isRequired
};

SpinnerInputWithLabel.propTypes = {
  labelText: PropTypes.string.isRequired,
  spinnerDefaultValue: PropTypes.number.isRequired,
  spinnerMaxValue: PropTypes.number.isRequired,
  spinnerLoanId: PropTypes.number.isRequired,
  isPrice: PropTypes.bool,
  disabled: PropTypes.bool
};

InvestmentCard.propTypes = {
  loanName: PropTypes.string.isRequired,
  phase: PropTypes.string.isRequired,
  tokens: PropTypes.number.isRequired,
  loanId: PropTypes.number.isRequired,
  inMarketplace: PropTypes.number.isRequired
};

export default InvestmentCard;
