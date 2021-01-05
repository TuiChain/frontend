/* eslint-disable no-unused-vars */

import React, { useEffect, useState } from "react";
import LoanRequestService from "../../services/loanrequest.service";
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
  const loadID = props.loanID;
  const { onAccept, onReject } = props;

  return (
    <>
      <ActionButton color="success" onClick={() => onAccept(loadID)}>
        <CheckCircleIcon />
      </ActionButton>
      <ActionButton color="error" onClick={() => onReject(loadID)}>
        <CancelIcon />
      </ActionButton>
    </>
  );
};

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
      const data = await LoanRequestService.getPendingLoanRequests();
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
    { field: "student", headerName: "Student" },
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
          loadID={props.row.id}
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

      <div className={classes.grid}>
        <DataGrid
          rows={requests}
          loading={loading}
          columns={columns}
          pageSize={10}
          autoHeight
        />
      </div>

      <Modal
        open={Boolean(modal)}
        onClose={handleModalClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Card variant="outlined">
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Loan #{modal.id}
            </Typography>
            <Typography variant="h5" component="h2">
              Request date: {modal.request_date}
            </Typography>
            <Typography variant="h5" component="h2">
              Amount: {modal.amount}€
            </Typography>
            <Typography variant="h5" component="h2">
              School: {modal.school}€
            </Typography>
            <Typography variant="h5" component="h2">
              Course: {modal.course}€
            </Typography>
            <Typography variant="h5" component="h2">
              Description: {modal.desc}
            </Typography>
            <Typography variant="h5" component="h2">
              Country: {modal.country}
            </Typography>
            <Typography color="textSecondary">adjective</Typography>
            <Typography variant="body2" component="p">
              well meaning and kindly.
            </Typography>
          </CardContent>
          <CardActions>
            <Actions
              loadID={25}
              onAccept={acceptRequest}
              onReject={rejectRequest}
            />
          </CardActions>
        </Card>
      </Modal>

      <Toast open={open} onClose={handleClose} severity={toast.severity}>
        {toast.message}
      </Toast>
    </Box>
  );
};

export default withStyles(styles)(LoanRequests);
