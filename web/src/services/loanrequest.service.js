import axios from "axios";

const instance = axios.create({
  baseURL: "https://tuichain-backend.herokuapp.com/api/loanrequests",
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

const createLoanRequest = (
  school,
  course,
  amount,
  description,
  destination
) => {
  return instance
    .post("/new/", {
      school,
      course,
      amount,
      description,
      destination,
    })
    .then(() => {
      return true;
    })
    .catch((error) => {
      console.log(error.response);
      return false;
    });
};

const getLoan = (id) => {
  return instance
    .get(`/get/${id}/`)
    .then((response) => {
      console.log(response.data);
      return response.data.loan_request;
    })
    .catch((error) => {
      console.log(error.response);
      return null;
    });
};

const getPendingLoanRequests = () => {
  return instance
    .get("/get_all/") // todo
    .then((response) => {
      return response.data.loanrequests;
    })
    .catch((error) => {
      console.log(error.response);
      return false;
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

const getStudentLoans = () => {
  return instance
    .get(`/get_personal/`)
    .then((response) => {
      console.log("Personal loans: ", response.data.loanrequests);
      return response.data.loanrequests;
    })
    .catch((error) => {
      console.log(error.response);
      return [];
    });
};

export default {
  createLoanRequest,
  getLoan,
  getPendingLoanRequests,
  validateLoanRequest,
  closeLoanRequest,
  getStudentLoans,
};
