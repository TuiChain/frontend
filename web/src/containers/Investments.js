import React, { useEffect, useState } from "react";
import { Grid, makeStyles, Typography, Box } from "@material-ui/core";
import SimpleTable from "../components/SimpleTable";
import Status from "../components/Status";
import InvestmentCard from "../components/InvestmentCard";
import investmentService from "../services/investment.service";
import walletService from "../services/wallet.service";
import marketTransactionsService from "../services/market-transactions.service";
import DAI from "../components/DAI";

const columns = [
  {
    field: "name",
    headerName: "Loan",
    width: 210,
    // eslint-disable-next-line react/display-name
    renderCell: (params) => <div>{params.value}</div>,
  },
  {
    field: "nrTokens",
    headerName: "Tokens",
    type: "number",
    width: 100,
  },
  {
    field: "state",
    headerName: "Phase",
    width: 120,
    // eslint-disable-next-line react/display-name
    renderCell: (params) => <Status state={params.value} size="small" />,
  },
  {
    field: "nrTokens_market",
    headerName: "On the Market",
    type: "number",
    width: 150,
  },
  {
    field: "tokensPriceMarket",
    headerName: "Listed Price",
    type: "number",
    width: 150,
    // eslint-disable-next-line react/display-name
    renderCell: (params) => (
      <div style={{ display: "flex", alignItems: "center" }}>
        <Box pr={1}>
          <Typography>{params.value}</Typography>
        </Box>
        <DAI />
      </div>
    ),
  },
  {
    field: "_",
    headerName: "Total",
    type: "number",
    width: 130,
    // eslint-disable-next-line react/display-name
    renderCell: (params) => (
      <div style={{ display: "flex", alignItems: "center" }}>
        <Box pr={1}>
          <Typography>
            {params.row.tokensPriceMarket * params.row.nrTokens_market}
          </Typography>
        </Box>
        <DAI />
      </div>
    ),
  },
];

const validStates = ["ACTIVE", "EXPIRED", "FUNDING", "FINALIZED"];

const Investments = () => {
  const [investments, setInvestments] = useState([]);
  const [selected, setSelected] = useState();
  const [account] = useState(walletService.checkAccount());

  async function getResponseFromAPI(account) {
    let investments = await investmentService.getPersonal(account);
    investments = investments
      .filter((entry) => validStates.includes(entry.loan.state))
      .map((entry) => {
        const flatEntry = { ...entry.loan };
        flatEntry.nrTokens = entry.nrTokens;
        flatEntry.nrTokens_market = entry.nrTokens_market;
        flatEntry.tokensPriceMarket = entry.price_per_token_market
          ? marketTransactionsService.priceAttoDaiToFloat(
              entry.price_per_token_market
            )
          : 0;
        flatEntry.current_value_atto_dai = entry.loan.current_value_atto_dai
          ? marketTransactionsService.priceAttoDaiToFloat(
              entry.loan.current_value_atto_dai
            )
          : 0;
        flatEntry.name = entry.name;
        return flatEntry;
      });
    setInvestments(investments);
    setSelected(investments ? investments[0] : undefined);
  }

  useEffect(() => {
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
        backgroundColor: "white",
        borderRadius: 4,
        boxShadow:
          "0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)",
      },
    },
  }));

  const handleRefresh = () => {
    if (account != null) {
      getResponseFromAPI(account);
    }
  };

  const classes = useStyles();

  return (
    <div>
      <Typography variant="h3" paragraph>
        My Investments
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={7}>
          <Box
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
          </Box>
        </Grid>
        <Grid item xs={5}>
          {selected != undefined && (
            <InvestmentCard
              handleRefresh={handleRefresh}
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
