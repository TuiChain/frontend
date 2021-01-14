/* eslint-disable no-unused-vars */

import React, { useEffect, useState } from "react";
import LoansService from "../../services/loans.service";
import { DataGrid } from "@material-ui/data-grid";
import {
  IconButton,
  makeStyles,
  Typography,
  withStyles,
  Box,
  Modal,
  Card,
  CardContent,
  CardActions,
  Button,
} from "@material-ui/core";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CancelIcon from "@material-ui/icons/Cancel";
import Toast from "../../components/Toast";

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
  const { onAccept, onReject, loanID } = props;

  return (
    <>
      <ActionButton color="success" onClick={() => onAccept(loanID)}>
        <CheckCircleIcon />
      </ActionButton>
      <ActionButton color="error" onClick={() => onReject(loanID)}>
        <CancelIcon />
      </ActionButton>
    </>
  );
};

const Description = ({ modal, onAccept, onReject, onClose }) => (
  <Modal
    open={Boolean(modal)}
    onClose={onClose}
    aria-labelledby="simple-modal-title"
    aria-describedby="simple-modal-description"
    style={{
      display: "flex",
      maxWidth: "80%",
      margin: "0 auto",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <Card variant="outlined">
      <CardContent>
        <Typography color="textSecondary" variant="h4" gutterBottom>
          Loan #{modal.id}
        </Typography>
        <Typography variant="h5" component="h3">
          Request date
          <Typography paragraph>
            {new Date(modal.request_date).toLocaleString()}
          </Typography>
        </Typography>
        <Typography variant="h5" component="h3">
          Destination
          <Typography paragraph>{modal.destination}</Typography>
        </Typography>
        <Typography variant="h5" component="h3">
          School
          <Typography paragraph>{modal.school}</Typography>
        </Typography>
        <Typography variant="h5" component="h3">
          Course
          <Typography paragraph>{modal.course}</Typography>
        </Typography>
        <Typography variant="h5" component="h3">
          Amount
          <Typography paragraph>{modal.amount}€</Typography>
        </Typography>
        <Typography variant="h5" component="h3">
          Description
          <Typography paragraph>{modal.desc}</Typography>
        </Typography>
      </CardContent>
      <CardActions>
        <Actions loanID={modal.id} onAccept={onAccept} onReject={onReject} />
      </CardActions>
    </Card>
  </Modal>
);

const LoanRequests = (props) => {
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
  const [requests, setRequests] = useState([]);
  useEffect(() => {
    async function fetchRequests() {
      const data = await LoansService.getPendingLoans();
      console.log(data);
      setRequests(data);
      setLoading(false);
    }
    fetchRequests();
  }, []);

  // Description modal
  const [modal, setModal] = useState(false);
  const handleModalOpen = (request) => {
    console.log(request);
    setModal(request);
  };
  const handleModalClose = () => {
    setModal(false);
  };

  const acceptRequest = async (id) => {
    console.log("ID:", id);
    const valid = await LoansService.validateLoan(id);

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
    const valid = await LoansService.closeLoan(id);

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
    { field: "student", headerName: "Student" },
    {
      field: "request_date",
      headerName: "Request Date",
      valueGetter: (params) =>
        new Date(params.row.request_date).toLocaleString(),
      width: 210,
    },
    {
      field: "amount",
      headerName: "Amount",
      type: "number",
      width: 110,
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
      field: "desc",
      headerName: "Description",
      sortable: false,
      // eslint-disable-next-line react/display-name
      renderCell: (props) => (
        <button type="button" onClick={() => handleModalOpen(props.row)}>
          More...
        </button>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 130,
      description: "This column is not sortable.",
      sortable: false,
      // eslint-disable-next-line react/display-name
      renderCell: (props) => (
        <Actions
          loanID={props.row.id}
          onAccept={acceptRequest}
          onReject={rejectRequest}
        />
      ),
    },
  ];

  return (
    <Box>
      <Typography variant="h2" paragraph>
        Pending Requests
      </Typography>

      <Box className={classes.grid}>
        <DataGrid
          rows={requests}
          loading={loading}
          columns={columns}
          pageSize={10}
          autoHeight
        />
      </Box>

      <Description
        modal={modal}
        onAccept={acceptRequest}
        onReject={rejectRequest}
        onClose={handleModalClose}
      />

      <Toast open={open} onClose={handleClose} severity={toast.severity}>
        {toast.message}
      </Toast>
    </Box>
  );
};

export default withStyles(styles)(LoanRequests);
