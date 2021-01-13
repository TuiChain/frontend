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
      amount,
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

const getPendingLoanRequests = () => {
  return instance
    .get("/get_all/") // todo
    .then((response) => {
      return response.data.loanrequests;
    })
    .catch((error) => {
      console.error(error.response);
      return [];
    });
};

const validateLoanRequest = (id) => {
  return instance
    .put(`/validate/${id}/`)
    .then((response) => {
      console.log("Validated: ", response.data.message);
      return true;
    })
    .catch((error) => {
      console.log(error.response);
      return false;
    });
};

const closeLoanRequest = (id) => {
  return instance
    .put(`/close/${id}/`)
    .then((response) => {
      console.log("Closed: ", response.data.message);
      return true;
    })
    .catch((error) => {
      console.log(error.response);
      return false;
    });
};

export default {
  createLoan,
  getPendingLoanRequests,
  validateLoanRequest,
  closeLoanRequest,
};