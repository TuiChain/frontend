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

const createLoanRequest = (school, course, amount) => {
  return instance
    .post("/new/", {
      school,
      course,
      amount,
    })
    .then(() => {
      return true;
    })
    .catch((error) => {
      console.log(error.response);
      return false;
    });
};

const getLoanRequests = () => {
  return instance
    .get("/get_all/")
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

export default {
  createLoanRequest,
  getLoanRequests,
  validateLoanRequest,
  closeLoanRequest,
};
