import React, { useEffect, useState } from "react";
import DocumentsService from "../../services/documents.service";
import { DataGrid } from "@material-ui/data-grid";
import {
  IconButton,
  makeStyles,
  Typography,
  withStyles,
  Box,
  Link,
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
  const { onAccept, onReject, documentID } = props;

  return (
    <>
      <ActionButton color="success" onClick={() => onAccept(documentID)}>
        <CheckCircleIcon />
      </ActionButton>
      <ActionButton color="error" onClick={() => onReject(documentID)}>
        <CancelIcon />
      </ActionButton>
    </>
  );
};

const Documents = (props) => {
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

  // Pending Documents
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState([]);
  useEffect(() => {
    async function fetchDocuments() {
      const data = await DocumentsService.getPendingDocuments();
      setDocuments(data);
      setLoading(false);
    }
    fetchDocuments();
  }, []);

  const validateDocument = async (id) => {
    const valid = await DocumentsService.validateDocument(id);

    if (valid) {
      const filtered_documents = documents.filter((d) => d.id != id);
      setDocuments(filtered_documents);
      setToast({
        message: "Document accepted!",
        severity: "success",
      });
      setOpen(true);
    } else {
      setToast({
        message: "Couldn't accept document. Please try again.",
        severity: "error",
      });
      setOpen(true);
    }
  };

  const rejectDocument = async (id) => {
    console.log("ID REJECTED:", id);
    const valid = await DocumentsService.rejectDocument(id);

    if (valid) {
      const filtered_documents = documents.filter((d) => d.id != id);
      setDocuments(filtered_documents);
      setToast({
        message: "Document rejected.",
        severity: "success",
      });
      setOpen(true);
    } else {
      setToast({
        message: "Couldn't reject document. Please try again.",
        severity: "error",
      });
      setOpen(true);
    }
  };

  const columns = [
    { field: "id", headerName: "ID" },
    { field: "student", headerName: "Student", width: 250 },
    { field: "course", headerName: "Course", width: 250 },
    {
      field: "document",
      headerName: "Document",
      sortable: false,
      width: 150,
      // eslint-disable-next-line react/display-name
      renderCell: (props) => (
        <Link
          href={props.row.url}
          target="_blank"
          key={props.row.id}
          underline="none"
        >
          <button>Open...</button>
        </Link>
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
          documentID={props.row.id}
          onAccept={validateDocument}
          onReject={rejectDocument}
        />
      ),
    },
  ];

  return (
    <Box>
      <Typography variant="h2" paragraph>
        Documents uploaded
      </Typography>

      <Box className={classes.grid}>
        <DataGrid
          rows={documents}
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

export default withStyles(styles)(Documents);
