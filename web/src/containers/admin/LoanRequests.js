import React, { useEffect, useState } from "react";
import LoanRequestService from "../../services/loanrequest.service";
import { DataGrid } from "@material-ui/data-grid";
import {
  IconButton,
  makeStyles,
  Typography,
  withStyles,
  Container as Grid,
} from "@material-ui/core";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CancelIcon from "@material-ui/icons/Cancel";
import Toast from "../../components/Toast";

const styles = {
  container: {
    maxWidth: 1500,
    padding: "20px 30px",
  },
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
  const loan_id = props.row.id;
  const { onAccept, onReject } = props;

  return (
    <>
      <ActionButton color="success" onClick={() => onAccept(loan_id)}>
        <CheckCircleIcon />
      </ActionButton>
      <ActionButton color="error" onClick={() => onReject(loan_id)}>
        <CancelIcon />
      </ActionButton>
    </>
  );
};

const LoanRequests = (props) => {
  const { classes } = props;

  const [toast, setToast] = React.useState({});
  const [open, setOpen] = React.useState(false);
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  useEffect(() => {
    async function fetchRequests() {
      const data = await LoanRequestService.getLoanRequests();
      console.log(data);
      setRequests(data);
      setLoading(false);
    }
    fetchRequests();
  }, []);

  const acceptRequest = async (id) => {
    console.log("ID:", id);
    const valid = await LoanRequestService.validateLoanRequest(id);

    if (valid) {
      const filtered_requests = requests.filter((e) => e.id != id);
      setRequests(filtered_requests);
      setToast({
        message: "Request accepted!",
        severity: "success",
      });
      setOpen(true);
    } else {
      setToast({
        message: "Couldn't accept request. Please try again.",
        severity: "error",
      });
      setOpen(true);
    }
  };

  const rejectRequest = async (id) => {
    console.log("ID REJECTED:", id);
    const valid = await LoanRequestService.closeLoanRequest(id);

    if (valid) {
      const filtered_requests = requests.filter((e) => e.id != id);
      setRequests(filtered_requests);
      setToast({
        message: "Request rejected.",
        severity: "success",
      });
      setOpen(true);
    } else {
      setToast({
        message: "Couldn't reject request. Please try again.",
        severity: "error",
      });
      setOpen(true);
    }
  };

  const columns = [
    { field: "id", headerName: "ID" },
    { field: "student", headerName: "Student ID" },
    {
      field: "request_date",
      headerName: "Request Date",
      valueGetter: (params) => new Date(params.row.request_date).toISOString(),
      width: 220,
    },
    {
      field: "amount",
      headerName: "Amount",
      type: "number",
      width: 140,
    },
    {
      field: "school",
      headerName: "School",
      width: 350,
    },
    {
      field: "course",
      headerName: "Course",
      width: 350,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 130,
      description: "This column is not sortable.",
      sortable: false,
      // eslint-disable-next-line react/display-name
      renderCell: (props) => (
        <Actions {...props} onAccept={acceptRequest} onReject={rejectRequest} />
      ),
    },
  ];

  return (
    <Grid className={classes.container}>
      <Typography variant="h2" paragraph>
        Pending Requests
      </Typography>

      <div className={classes.grid}>
        <DataGrid
          rows={requests}
          loading={loading}
          columns={columns}
          pageSize={10}
          autoHeight
        />
      </div>

      <Toast open={open} onClose={handleClose} severity={toast.severity}>
        {toast.message}
      </Toast>
    </Grid>
  );
};

export default withStyles(styles)(LoanRequests);
