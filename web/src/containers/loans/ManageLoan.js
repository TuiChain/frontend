import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Box, Chip, TextField, Typography } from "@material-ui/core";

const ManageLoan = (props) => {
  console.log(props);
  const loanID = props.match.params.id;
  //   const [loan, setLoan] = useState(null);

  useEffect(() => {
    async function fetchLoan() {
      //const data = await LoanRequestService.getLoanRequest(loanID);
      //console.log(data);
    }
    fetchLoan();
  }, []);

  return (
    <>
      <Typography>
        Loan #{loanID} <Chip size="small" label="Status" />
      </Typography>

      <Box>Loan info</Box>
      <hr />
      <Box>
        Update info
        <TextField type="file" variant="outlined" />
      </Box>
      <hr />
      <Box>Cancel</Box>
    </>
  );
};

ManageLoan.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }),
  }),
};

export default ManageLoan;
