import React, { useState } from "react";
import PropTypes from "prop-types";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import {
  Button,
  CardHeader,
  Grid,
  makeStyles,
  Typography,
} from "@material-ui/core";
import theme from "../theme";
import SpinnerInputWithLabel from "./SpinnerInputWithLabel";
import InputWithLabel from "./InputWithLabel";
import loansTransactionsService from "../services/loans-transactions.service";
import marketTransactionsService from "../services/market-transactions.service";

const useStyles = makeStyles({
  root: {
    "& .MuiTypography-body1": {
      fontSize: 20,
      fontWeight: 300,
    },
    "& [type=number]": {
      "-moz-appearance": "textfield",
      textAlign: "right",
    },
    "& .MuiInput-input": {
      "-moz-appearance": "textfield",
      textAlign: "right",
    },
    "& ::-webkit-outer-spin-button": {
      "-webkit-appearance": "none",
      margin: 0,
    },
    "& ::-webkit-inner-spin-button": {
      "-webkit-appearance": "none",
      margin: 0,
    },
  },
  headers: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.primary.contrastText,
  },
  chip: {
    width: 100,
    color: theme.palette.primary.contrastText,
  },
});

const copy = {
  ACTIVE: {
    titleText: "List your tokens in the marketplace",
    buttonText: "List",
    removeText: "Remove all",
  },
  FUNDING: {
    titleText: "Cancel your funding",
    buttonText: "Cancel",
  },
  FINALIZED: {
    titleText: "Reedem your tokens",
    buttonText: "Redeem",
  },
  EXPIRED: {
    titleText: "Cash out your tokens",
    buttonText: "Cash out",
  },
};

const InvestmentCard = (props) => {
  const investmentCardHeader = (classes, loanName) => (
    <CardHeader className={classes.headers} title={`Loan to ${loanName}`} />
  );

  const activePhaseInputContent = () => (
    <Grid
      style={{ height: 80 }}
      container
      direction="column"
      justify="space-between"
    >
      <Grid container justify="space-between">
        <SpinnerInputWithLabel
          labelText="Quantity:"
          spinnerDefaultValue={props.inMarketplace}
          spinnerMaxValue={props.tokens}
          spinnerLoanId={props.loanId}
          onNewValue={onNewQuantity}
        />
      </Grid>
      <Grid container justify="space-between">
        <SpinnerInputWithLabel
          labelText="Price per token:"
          spinnerDefaultValue={props.tokensPriceMarket}
          spinnerMaxValue={props.tokens}
          spinnerLoanId={props.loanId}
          isPrice={true}
          onNewValue={onNewPrice}
        />
      </Grid>
    </Grid>
  );

  const finalizedPhaseInputContent = () => (
    <Grid
      style={{ height: 80 }}
      container
      direction="column"
      justify="space-between"
    >
      <InputWithLabel
        labelText="Quantity:"
        defaultValue={props.tokens}
        isCurrency={false}
      />
      <InputWithLabel
        labelText="Price:"
        defaultValue={marketTransactionsService.priceAttoDaiToFloat(
          BigInt(props.tokens) * BigInt(props.redeemPrice)
        )}
        isCurrency={true}
      />
    </Grid>
  );

  const fundingPhaseInputContent = () => (
    <Grid
      style={{ height: 80 }}
      container
      direction="column"
      justify="space-between"
    >
      <InputWithLabel
        labelText="Quantity:"
        defaultValue={props.tokens}
        isCurrency={false}
      />
      <InputWithLabel
        labelText="Payback:"
        defaultValue={props.tokens}
        isCurrency={true}
      />
    </Grid>
  );

  const expiredPhaseInputContent = () => (
    <Grid
      style={{ height: 80 }}
      container
      direction="column"
      justify="space-between"
    >
      <InputWithLabel
        labelText="Quantity:"
        defaultValue={props.tokens}
        isCurrency={false}
      />
      <InputWithLabel
        labelText="Payback:"
        defaultValue={props.tokens}
        isCurrency={true}
      />
    </Grid>
  );

  const renderPhaseInputContent = () => {
    switch (props.phase) {
      case "ACTIVE":
        return activePhaseInputContent();
      case "FUNDING":
        return fundingPhaseInputContent();
      case "FINALIZED":
        return finalizedPhaseInputContent();
      case "EXPIRED":
        return expiredPhaseInputContent();
    }
  };

  const handleCancelClick = async () => {
    try {
      await loansTransactionsService.withdrawFunds(props.loanId, props.tokens);
    } catch (e) {
      console.log(e);
    }
  };

  const handleSellPositionQuantityChange = async () => {
    if (props.inMarketplace > newQuantity) {
      await marketTransactionsService.decreaseSellPositionAmount(
        props.loanId,
        props.inMarketplace - newQuantity
      );
    } else {
      await marketTransactionsService.increaseSellPositionAmount(
        props.loanId,
        newQuantity - props.inMarketplace
      );
    }
  };

  const handleSellPositionPriceChange = async () => {
    if (props.tokensPriceMarket !== newPrice) {
      await marketTransactionsService.updateSellPositionPrice(
        props.loanId,
        newPrice
      );
    }
  };

  const handleListClick = async () => {
    try {
      if (props.inMarketplace === 0 && newQuantity != 0 && newPrice != 0) {
        await marketTransactionsService.createSellPosition(
          props.loanId,
          newQuantity,
          newPrice
        );
      } else {
        if (newPrice !== 0) {
          await handleSellPositionPriceChange();
        }
        if (newQuantity !== 0) {
          await handleSellPositionQuantityChange();
        }
      }
      props.handleRefresh();
    } catch (e) {
      console.log(e);
    }
  };

  const handleRedeemClick = async () => {
    try {
      await loansTransactionsService.redeemTokens(props.loanId, props.tokens);
    } catch (e) {
      console.log(e);
    }
  };

  const handleRemoveButtonClick = async () => {
    try {
      await marketTransactionsService.removeSellPosition(props.loanId);
    } catch (e) {
      console.log(e);
    }
  };

  const handleButtonClick = () => {
    switch (props.phase) {
      case "ACTIVE":
        return handleListClick();
      case "FUNDING":
        return handleCancelClick();
      case "FINALIZED":
        return handleRedeemClick();
      // case 'EXPIRED':
      //   return expiredPhaseInputContent(props)
    }
  };

  const renderPhaseContent = () => {
    return (
      <CardContent>
        <Grid
          style={{ height: 250 }}
          container
          direction="column"
          justify="space-between"
        >
          <Grid item>
            <Typography variant="h6">{copy[props.phase].titleText}</Typography>
          </Grid>
          <Grid
            style={{ height: 80 }}
            container
            direction="column"
            justify="space-between"
          >
            {renderPhaseInputContent(props)}
          </Grid>
          <Grid container justify="flex-end">
            {props.inMarketplace > 0 && (
              <Grid item>
                <Button
                  onClick={() => handleRemoveButtonClick(props)}
                  style={{ alignSelf: "flex-end", width: 120 }}
                  variant="outlined"
                  size="medium"
                  color="secondary"
                >
                  {copy[props.phase].removeText}
                </Button>
              </Grid>
            )}
            <Grid item>
              <Button
                onClick={() => handleButtonClick(props)}
                style={{ alignSelf: "flex-end", width: 120 }}
                variant="outlined"
                size="medium"
                color="secondary"
              >
                {copy[props.phase].buttonText}
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    );
  };

  const classes = useStyles();
  const [newQuantity, setNewQuantity] = useState(0);
  const [newPrice, setNewPrice] = useState(0);

  const onNewQuantity = (newQuantity) => {
    setNewQuantity(newQuantity);
  };

  const onNewPrice = (newPrice) => {
    setNewPrice(newPrice);
  };

  return (
    <Card className={classes.root}>
      {investmentCardHeader(classes, props.loanName)}
      {renderPhaseContent()}
    </Card>
  );
};

InvestmentCard.propTypes = {
  loanName: PropTypes.string.isRequired,
  phase: PropTypes.string.isRequired,
  tokens: PropTypes.number.isRequired,
  loanId: PropTypes.number.isRequired,
  inMarketplace: PropTypes.number.isRequired,
  tokensPriceMarket: PropTypes.number.isRequired,
  redeemPrice: PropTypes.number,
  handleRefresh: PropTypes.func,
};

export default InvestmentCard;
