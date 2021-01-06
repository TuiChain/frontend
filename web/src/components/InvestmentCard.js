import React from 'react';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { Button, CardHeader, Chip, Grid, makeStyles, TextField, Typography } from '@material-ui/core';
import { green, yellow } from '@material-ui/core/colors';
import theme from '../theme';
import SpinnerInput from './SpinnerInput';
import CurrencyTextField from '@unicef/material-ui-currency-textfield';

const useStyles = makeStyles({
  root: {
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
  }
});

const getPhaseChipColor = (phase) => {
  switch (phase) {
    case 'active':
      return green[400]
    case 'funding':
      return yellow[900]
    case 'completed':
      return theme.palette.primary.main
  }
}

const investmentCardHeader = (phase, loanName) =>
  <CardHeader
    style={{backgroundColor: theme.palette.secondary.main, color: theme.palette.primary.contrastText}}
    action={
      <Chip 
          style={{width: 100, color: theme.palette.primary.contrastText ,backgroundColor: getPhaseChipColor(phase)}}
          label={phase}
        />
    }
    title={loanName}
  />

const labelsStyle = {
  fontSize: 20,
  fontWeight: 300
}  

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
          <Typography style={labelsStyle} variant='body1'>Quantity:</Typography>
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
          <Typography style={labelsStyle} variant='body1'>Price:</Typography>
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

const completedPhaseContent = (props) =>
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
          <Typography style={labelsStyle} variant='body1'>Quantity:</Typography>
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
          <Typography style={labelsStyle} variant='body1'>Price:</Typography>
        </Grid>
        <Grid item>
          <CurrencyTextField
            style={{width: 100, marginRight: 30}}
            variant="standard"
            value={props.tokens*1} //received from the backend
            currencySymbol="$"
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
          <Typography style={labelsStyle} variant='body1'>Lost tokens :</Typography>
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
          <Typography style={labelsStyle} variant='body1'>Payback money:</Typography>
        </Grid>
        <Grid item>
          <CurrencyTextField
            style={{width: 100}}
            variant="standard"
            value={props.tokens}
            currencySymbol="$"
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
    case 'completed':
      return completedPhaseContent(props)
  }
}

const InvestmentCard = props => {
  const classes = useStyles()
  
  return (
    <Card className={classes.root}>
      {investmentCardHeader(props.phase, props.loanName)}
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
