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

const investmentCardHeader = (classes, phase, loanName) =>
  <CardHeader
    className={classes.headers}
    action={
      <Status state={phase} />
    }
    title={loanName}
  />

const activePhaseContent = (props) =>
  <CardContent>
  <Grid style={{height: 250}} container direction='column' justify='space-between'>
    <Grid item>
      <Typography variant='h6'>
        List your tokens in the marketplace
      </Typography>
    </Grid>
    <Grid style={{height: 80}} container direction='column' justify='space-between'>
      <Grid container justify='space-between'> 
        <Grid item>
          <Typography variant='body1'>Quantity:</Typography>
        </Grid>
        <Grid item>
          <SpinnerInput 
            defaultValue={props.inMarketplace} 
            minValue={0} 
            maxValue={props.tokens}
            loanId={props.loanId}
          />
        </Grid>
      </Grid>
      <Grid container justify='space-between'>
        <Grid item>
          <Typography variant='body1'>Price:</Typography>
        </Grid>
        <Grid item>
          <SpinnerInput 
            defaultValue={1.20} 
            minValue={0.2} 
            maxValue={props.tokens}
            loanId={props.loanId}
            step={0.2}
            isPrice={true}
          />
        </Grid>
      </Grid>  
    </Grid>
    <Grid container justify='flex-end'>
      <Grid item>
        <Button style={{alignSelf: 'flex-end', width: 100}} variant="contained" size="medium" color="primary">
          List
        </Button>
      </Grid>
    </Grid>
  </Grid>
  </CardContent>

const finalizedPhaseContent = (props) =>
  <CardContent>
  <Grid style={{height: 250}} container direction='column' justify='space-between'>
    <Grid item>
      <Typography variant='h6'>
        Reedem your tokens
      </Typography>
    </Grid>
    <Grid style={{height: 80}} container direction='column' justify='space-between'>
      <Grid container justify='space-between'> 
        <Grid item>
          <Typography variant='body1'>Quantity:</Typography>
        </Grid>
        <Grid item>
          <SpinnerInput 
            defaultValue={props.tokens} 
            minValue={0} 
            maxValue={props.tokens}
            loanId={props.loanId}
          />
        </Grid>
      </Grid>
      <Grid container justify='space-between'>
        <Grid item>
          <Typography variant='body1'>Price:</Typography>
        </Grid>
        <Grid item>
          <CurrencyTextField
            style={{width: 100, marginRight: 30}}
            variant="standard"
            value={props.tokens*1} //received from the backend
            currencySymbol={<DAI/>}
            outputFormat="number"
            disabled
          />
        </Grid>
      </Grid>  
    </Grid>
    <Grid container justify='flex-end'>
      <Grid item>
        <Button style={{alignSelf: 'flex-end', width: 100}} variant="contained" size="medium" color="primary">
          Reedem
        </Button>
      </Grid>
    </Grid>
  </Grid>
  </CardContent>

const fundingPhaseContent = (props) =>
  <CardContent>
  <Grid style={{height: 250}} container direction='column' justify='space-between'>
    <Grid item>
      <Typography variant='h6'>
        Cancel your funding
      </Typography>
    </Grid>
    <Grid style={{height: 80}} container direction='column' justify='space-between'>
      <Grid container justify='space-between'> 
        <Grid item>
          <Typography variant='body1'>Lost tokens :</Typography>
        </Grid>
        <Grid item>
          <TextField 
            style={{width: 100}}
            id="standard-number"
            type="number"
            disabled
            defaultValue={props.tokens}
          />
        </Grid>
      </Grid>
      <Grid container justify='space-between'> 
        <Grid item>
          <Typography variant='body1'>Payback money:</Typography>
        </Grid>
        <Grid item>
          <CurrencyTextField
            style={{width: 100}}
            variant="standard"
            value={props.tokens}
            currencySymbol={<DAI />}
            outputFormat="number"
            disabled
          />
        </Grid>
      </Grid>
    </Grid>
    <Grid container justify='flex-end'>
      <Grid item>
        <Button style={{alignSelf: 'flex-end', width: 100}} variant="contained" size="medium" color="primary">
          Cancel
        </Button>
      </Grid>
    </Grid>
  </Grid>
  </CardContent>

const renderPhaseContent = props => {
  switch (props.phase) {
    case 'active':
      return activePhaseContent(props)
    case 'funding':
      return fundingPhaseContent(props)
    case 'finalized':
      return finalizedPhaseContent(props)
  }
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

InvestmentCard.propTypes = {
  loanName: PropTypes.string.isRequired,
  phase: PropTypes.string.isRequired,
  tokens: PropTypes.number.isRequired,
  loanId: PropTypes.number.isRequired,
  inMarketplace: PropTypes.number.isRequired
};

export default InvestmentCard;
