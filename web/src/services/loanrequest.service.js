import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

const instance = axios.create({
  baseURL: `${API_URL}/loanrequests`,
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
      for (let index = 0; index < 7; index++) {
        response.data.loanrequests.push(
          JSON.parse(JSON.stringify(response.data.loanrequests[0]))
        );
      }
      for (let index = 0; index < response.data.loanrequests.length; index++) {
        response.data.loanrequests[index].status = index;
        response.data.loanrequests[index].amount = index;
      }
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
