import React, { useEffect, useState } from "react";
import { Grid, Icon, makeStyles, Typography } from "@material-ui/core";
import SimpleTable from "../components/SimpleTable";
import MonetizationOnTwoToneIcon from "@material-ui/icons/MonetizationOnTwoTone";
import { yellow } from "@material-ui/core/colors";
import InvestmentCard from "../components/InvestmentCard";
import investmentService from "../services/investment.service";
import walletService from "../services/wallet.service";
import marketTransactionsService from "../services/market-transactions.service";

const columns = [
  {
    field: "name",
    headerName: "Loan",
    width: 160,
    headerClassName: "data-grid-header",
    // eslint-disable-next-line react/display-name
    renderCell: (params) => (
      <div>Loan to {params.value ? params.value : "Nelson"}</div>
    ),
  },
  {
    field: "nrTokens",
    headerName: "Tokens",
    type: "number",
    width: 100,
    headerClassName: "data-grid-header",
    // eslint-disable-next-line react/display-name
    renderCell: (params) => (
      <div style={{ display: "flex", alignItems: "center" }}>
        {params.value}
        <Icon style={{ marginLeft: 4, fontSize: 20 }}>
          <MonetizationOnTwoToneIcon style={{ color: yellow[700] }} />
        </Icon>
      </div>
    ),
  },
  {
    field: "state",
    headerName: "Phase",
    headerClassName: "data-grid-header",
    width: 120,
  },
  {
    field: "nrTokens_market",
    headerName: "On the Market",
    type: "number",
    width: 150,
    headerClassName: "data-grid-header",
  },
  {
    field: "tokensPriceMarket",
    headerName: "Listed Price",
    type: "number",
    width: 130,
    headerClassName: "data-grid-header",
  },
];

const validStates = ["ACTIVE", "EXPIRED", "FUNDING", "FINALIZED"];

const Investments = () => {
  const [investments, setInvestments] = useState([]);
  const [selected, setSelected] = useState();

  useEffect(() => {
    async function getResponseFromAPI(account) {
      const resp = await investmentService.getPersonal(account);
      console.log(resp);
      const investments = resp.data.investments
        .filter((entry) => validStates.includes(entry.loan.state))
        .map((entry) => {
          const flatEntry = { ...entry.loan };
          flatEntry.nrTokens = entry.nrTokens;
          flatEntry.nrTokens_market = entry.nrTokens_market;
          flatEntry.tokensPriceMarket = marketTransactionsService.priceAttoDaiToFloat(
            entry.price_per_token_market
          );

          return flatEntry;
        });
      setInvestments(investments);
      setSelected(investments ? investments[0] : undefined);
    }

    const account = walletService.checkAccount();
    if (account != null) {
      getResponseFromAPI(account);
    }
  }, []);

  const useStyles = makeStyles((theme) => ({
    root: {
      "& .MuiDataGrid-columnsContainer": {
        backgroundColor: theme.palette.secondary.main,
        color: theme.palette.primary.contrastText,
      },
      "& .MuiSvgIcon-root": {
        color: theme.palette.primary.contrastText,
      },
      "& .MuiDataGrid-cellRight": {
        justifyContent: "flex-end",
      },
      "& .MuiDataGrid-root": {
        borderRadius: 4,
        boxShadow:
          "0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)",
      },
    },
  }));

  const classes = useStyles();

  return (
    <div>
      <Typography variant="h3" paragraph>
        My Investments
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={8}>
          <div
            style={{ display: "flex", width: "100%" }}
            className={classes.root}
          >
            <SimpleTable
              columns={columns}
              rows={investments}
              onSelectionChange={(newSelection) => {
                const index = investments.findIndex(
                  (elem) => elem.id == newSelection.rowIds[0]
                );
                setSelected(investments[index]);
              }}
            />
          </div>
        </Grid>
        <Grid item xs={4}>
          {selected != undefined && (
            <InvestmentCard
              loanName={selected.name}
              phase={selected.state}
              tokens={selected.nrTokens}
              inMarketplace={selected.nrTokens_market}
              loanId={selected.id}
              tokensPriceMarket={selected.tokensPriceMarket}
              redeemPrice={selected.current_value_atto_dai}
            />
          )}
        </Grid>
      </Grid>
    </div>
  );
};

export default Investments;
