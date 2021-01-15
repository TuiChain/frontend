import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

const instance = axios.create({
  baseURL: `${API_URL}/loans`,
});

instance.interceptors.request.use(
  (config) => {
    const token = "Token " + localStorage.getItem("user_token");
    config.headers.Authorization = token;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const createLoan = (
  school,
  course,
  amount,
  description,
  destination,
  recipient_address
) => {
  return instance
    .post("/new/", {
      school,
      course,
      requested_value_atto_dai: (
        BigInt(amount) *
        BigInt(10) ** BigInt(18)
      ).toString(),
      description,
      destination,
      recipient_address,
    })
    .then(() => {
      return true;
    })
    .catch((error) => {
      console.log(error.response);
      return false;
    });
};

const getPendingLoans = () => {
  return instance
    .get("/get_all/") // todo
    .then((response) => {
      console.log(response.data);
      return response.data.loans;
    })
    .catch((error) => {
      console.error(error.response);
      return [];
    });
};

const validateLoan = (id) => {
  return instance
    .put(`/validate/${id}/`, {
      days_to_expiration: 100,
      funding_fee_atto_dai_per_dai: (
        BigInt(10) *
        BigInt(10) ** BigInt(16)
      ).toString(),
      payment_fee_atto_dai_per_dai: (
        BigInt(10) *
        BigInt(10) ** BigInt(16)
      ).toString(),
    })
    .then((response) => {
      console.log("Validated: ", response.data.message);
      return true;
    })
    .catch((error) => {
      console.log(error.response);
      return false;
    });
};

const rejectLoan = (id) => {
  return instance
    .put(`/reject/${id}/`)
    .then((response) => {
      console.log("Closed: ", response.data.message);
      return true;
    })
    .catch((error) => {
      console.log(error.response);
      return false;
    });
};

const getLoan = (id) => {
  return instance
    .get("/get/" + id + "/")
    .then((response) => {
      return response.data.loan_request;
    })
    .catch((error) => {
      console.log(error);
      return false;
    });
};

const getStudentLoans = () => {
  return instance
    .get(`/get_personal/`)
    .then((response) => {
      // TODO
      console.log("Personal loans: ", response.data.loans);
      for (let index = 0; index < 7; index++) {
        response.data.loans.push(
          JSON.parse(JSON.stringify(response.data.loans[0]))
        );
      }
      response.data.loans[0].state = "Funding";
      response.data.loans[1].state = "Expired";
      response.data.loans[2].state = "Canceled";
      response.data.loans[3].state = "Active";
      response.data.loans[4].state = "Finalized";
      response.data.loans[5].state = "Requested";
      response.data.loans[6].state = "Rejected";
      response.data.loans[0].id = 0;
      response.data.loans[1].id = 1;
      response.data.loans[2].id = 2;
      response.data.loans[3].id = 3;
      response.data.loans[4].id = 4;
      response.data.loans[5].id = 5;
      response.data.loans[6].id = 6;

      return response.data.loans;
    })
    .catch((error) => {
      console.log(error.response);
      return [];
    });
};

export default {
  createLoan,
  getPendingLoans,
  validateLoan,
  rejectLoan,
  getLoan,
  getStudentLoans,
};
