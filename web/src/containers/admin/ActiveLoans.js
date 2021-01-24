import React, { useEffect, useState } from "react";
import LoansService from "../../services/loans.service";
import { DataGrid } from "@material-ui/data-grid";
import {
  IconButton,
  makeStyles,
  Typography,
  withStyles,
  Box,
} from "@material-ui/core";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import Toast from "../../components/Toast";
import DAI from "../../components/DAI";

const styles = {
  grid: {
    display: "flex",
    height: 600,
  },
};

/* eslint react/prop-types: 0 */
const ActionButton = ({ color, children, onClick }) => {
  const classes = makeStyles((theme) => ({
    root: {
      color: theme.palette[color].main,
    },
  }))(IconButton);

  return (
    <IconButton className={classes.root} onClick={onClick}>
      {children}
    </IconButton>
  );
};

const Actions = (props) => {
  const { onFinalize, loanID } = props;

  return (
    <>
      <ActionButton color="success" onClick={() => onFinalize(loanID)}>
        <CheckCircleIcon />
      </ActionButton>
    </>
  );
};

const ActiveLoans = (props) => {
  const { classes } = props;

  // Toast
  const [toast, setToast] = React.useState({});
  const [open, setOpen] = React.useState(false);
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  // Pending Requests
  const [loading, setLoading] = useState(true);
  const [loans, setLoans] = useState([]);
  useEffect(() => {
    async function fetchLoans() {
      const data = await LoansService.getActiveLoans();
      setLoans(data);
      setLoading(false);
    }
    fetchLoans();
  }, []);

  const finalizeLoan = async (id) => {
    const valid = await LoansService.finalizeLoan(id);

    if (valid) {
      const filtered_loans = loans.filter((e) => e.id != id);
      setLoans(filtered_loans);
      setToast({
        message: "Loan finalized!",
        severity: "success",
      });
      setOpen(true);
    } else {
      setToast({
        message: "Couldn't finalize loan. Please try again.",
        severity: "error",
      });
      setOpen(true);
    }
  };

  const columns = [
    { field: "id", headerName: "ID" },
    { field: "student", headerName: "Student" },
    {
      field: "request_date",
      headerName: "Request Date",
      valueGetter: (params) =>
        new Date(params.row.request_date).toLocaleString(),
      width: 210,
    },
    {
      field: "requested_value_atto_dai",
      headerName: "Amount",
      type: "number",
      width: 110,
      // eslint-disable-next-line react/display-name
      renderCell: (props) => {
        return (
          <>
            <Box pr={1}>
              <Typography>{props.value / 10 ** 18}</Typography>
            </Box>
            <DAI size={16} />
          </>
        );
      },
    },
    {
      field: "school",
      headerName: "School",
      width: 280,
    },
    {
      field: "course",
      headerName: "Course",
      width: 280,
    },
    {
      field: "actions",
      headerName: "Finalize",
      width: 130,
      description: "This column is not sortable.",
      sortable: false,
      // eslint-disable-next-line react/display-name
      renderCell: (props) => (
        <Actions loanID={props.row.id} onFinalize={finalizeLoan} />
      ),
    },
  ];

  return (
    <Box>
      <Typography variant="h2" paragraph>
        Active Loans
      </Typography>

      <Box className={classes.grid}>
        <DataGrid
          rows={loans}
          loading={loading}
          columns={columns}
          pageSize={10}
          autoHeight
        />
      </Box>

      <Toast open={open} onClose={handleClose} severity={toast.severity}>
        {toast.message}
      </Toast>
    </Box>
  );
};

export default withStyles(styles)(ActiveLoans);
