import { Button, IconButton, makeStyles } from "@material-ui/core";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import TransitionsModal from "../components/Modal";
import { green, yellow, red } from "@material-ui/core/colors";
import kycService from "../services/kyc.service";
import theme from "../theme";
import RefreshIcon from "@material-ui/icons/Refresh";

const useStyles = makeStyles((theme) => ({
  iframe: {
    height: 500,
    width: 800,
    backgroundColor: theme.palette.background.paper,
  },
}));

const statusColors = {
  succeeded: green[400],
  processing: yellow[900],
  requires_action: red[600],
};

const KycButton = (props) => {
  const classes = useStyles();
  const [url, setUrl] = useState();
  const [open, setOpen] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState(
    props.verificationStatus
  );
  const [intentId, setIntentId] = useState(props.intentId);

  useEffect(() => {
    setIntentId(props.intentId);
    if (props.intentId !== undefined && !verificationStatus) {
      isVerified(props.intentId);
    }
  }, [props.intentId]);

  useEffect(() => {
    if ((intentId !== undefined, url != undefined)) {
      setOpen(true);
      window.addEventListener("message", handleStripeResponse);
    }
  }, [intentId]);

  const isVerified = (intentId) => {
    async function fetch() {
      const resp = await kycService.getVerificationResult(intentId);
      setVerificationStatus(resp.data.data.status);
    }
    if (intentId) fetch();
  };

  const handleStripeResponse = (event) => {
    async function fetch() {
      const resp = await kycService.getVerificationResult(intentId);
      setVerificationStatus(resp.data.data.status);
    }

    if (
      event.origin === "https://verify.stripe.com" &&
      intentId !== undefined
    ) {
      if (event.data.type === "success") {
        fetch();
        setOpen(false);
        setUrl(undefined);
        window.removeEventListener("message", handleStripeResponse);
      }
    }
  };

  const handleButtonClick = () => {
    async function fetchAndOpenWindow() {
      const resp = await kycService.startIdentityVerification();
      setUrl(resp.data.redirect_to_url);
      setIntentId(resp.data.intent_id);
    }

    fetchAndOpenWindow();
  };

  let pollingInterval = 2000;

  const calculateBackoff = function (interval) {
    const maxInterval = 60000;
    const backoffRate = 1.5;
    if (interval < maxInterval) {
      return parseInt(interval * backoffRate, 10);
    }
    return interval;
  };

  const renderText = () => {
    if (!verificationStatus) return "Verify your identity";

    switch (verificationStatus) {
      case "succeeded":
        return "Verified";
      case "processing":
        window.setTimeout(() => {
          isVerified(intentId);
          pollingInterval = calculateBackoff(pollingInterval);
        }, pollingInterval);
        return "Pending";
      case "requires_action":
        return "Failed";
    }
  };

  return (
    <div>
      <TransitionsModal
        open={open}
        src={url}
        handleClose={() => setOpen(false)}
      >
        <iframe
          allow="camera; microphone"
          className={classes.iframe}
          src={url}
        />
      </TransitionsModal>
      <Button
        onClick={handleButtonClick}
        disabled={verificationStatus !== undefined}
        style={{
          color: theme.palette.secondary.contrastText,
          backgroundColor: statusColors[verificationStatus]
            ? statusColors[verificationStatus]
            : theme.palette.primary.main,
        }}
      >
        {renderText()}
      </Button>
      {verificationStatus === "requires_action" && (
        <IconButton onClick={() => setVerificationStatus(undefined)}>
          <RefreshIcon />
        </IconButton>
      )}
    </div>
  );
};

KycButton.propTypes = {
  intentId: PropTypes.string,
  verificationStatus: PropTypes.string,
};

export default KycButton;
