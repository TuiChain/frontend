import React, { useEffect, useState } from "react";
import { Grid, Icon, makeStyles, Typography } from "@material-ui/core";
import SimpleTable from "../components/SimpleTable";
import MonetizationOnTwoToneIcon from "@material-ui/icons/MonetizationOnTwoTone";
import { yellow } from '@material-ui/core/colors';
import InvestmentCard from "../components/InvestmentCard";
import InvestmentsService from "../services/investments.service";

const columns = [
  { field: "loan", headerName: "Loan", width: 160, headerClassName: 'data-grid-header'},
  { 
    field: "tokens",
    headerName: "Tokens",
    type: "number",
    width: 120,
    headerClassName: 'data-grid-header',
    // eslint-disable-next-line react/display-name
    renderCell: (params) => (
      <div style={{display: 'flex', alignItems:'center'}}>
        {params.value}
        <Icon style={{marginLeft: 4}}>
          <MonetizationOnTwoToneIcon style={{color: yellow[700]}}/>
        </Icon>
      </div>
    )
  },
  { field: "phase", headerName: "Phase", headerClassName: 'data-grid-header'},
  { field: "inMarketplace", headerName: "Listed in the Market", type: "number",  width: 180, headerClassName: 'data-grid-header'}
]

const Investments = () => {
  const [investments, setInvestments] = useState([])
  const [selected, setSelected] = useState({loan: 'Mock'})

  useEffect(() => {
    async function getResponseFromAPI() {
     const response = await InvestmentsService.getPersonal()
     setInvestments(response)
     setSelected(response[0])
    }
    
    getResponseFromAPI()
  },[])

  const useStyles = makeStyles(theme => ({
    root: {
      '& .MuiDataGrid-columnsContainer': {
        backgroundColor: theme.palette.secondary.main,
        color: theme.palette.primary.contrastText
      },
      '& .MuiSvgIcon-root':{
        color: theme.palette.primary.contrastText
      },
      '& .MuiDataGrid-cellRight':{
        justifyContent:'flex-end'
      }
    }
  }));

  const classes = useStyles();

  return (
    <div>
      <Typography variant="h3" paragraph>
        My Investments
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={7}>
          <div style={{ display: 'flex', width: '100%' }} className={classes.root}>
            <SimpleTable
              columns={columns}
              rows={investments}
              onSelectionChange={(newSelection) => {
                setSelected(investments[newSelection.rowIds[0]])
              }}
            />
          </div>
        </Grid>
        <Grid item xs={5}>
          <InvestmentCard 
            loanName={selected.loan}
            phase={selected.phase}
            tokens={selected.tokens}
            inMarketplace={selected.inMarketplace}
            loanId={selected.id}
          />
        </Grid>
      </Grid>
    </div>
  )
}

export default Investments
