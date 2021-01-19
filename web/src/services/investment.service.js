import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

const instance = axios.create({
  baseURL: `${API_URL}/investments`,
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

const getInvestmentInLoan = (loan_id, account_address) => {
  return instance
    .get("/get/" + loan_id + "/" + account_address + "/")
    .then((response) => {
      return response.data.loan;
    })
    .catch((error) => {
      console.log(error);
    });
};

export default {
  getInvestmentInLoan,
};
