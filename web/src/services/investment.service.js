import axios from "axios";
import Web3 from "web3";

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
  const account = Web3.utils.toChecksumAddress(account_address);

  return instance
    .get("/get/" + loan_id + "/" + account + "/")
    .then((response) => {
      return response.data.investment;
    })
    .catch((error) => {
      console.log(error);
    });
};

// Investments for dashboard - limits 3
const getDashboardInvestments = () => {
  return instance
    .get(`/get_personal/`)
    .then((response) => {
      let investments = response.data.investments;

      investments = investments.slice(0, 3);

      investments.forEach((investment) => {
        investment.loan.requested_value = Number(
          BigInt(investment.loan.requested_value_atto_dai) / BigInt(10 ** 18)
        );

        investment.loan.funded_value = investment.loan.funded_value_atto_dai
          ? parseInt(investment.loan.funded_value_atto_dai) / 10 ** 18
          : 0;
      });

      return investments;
    })
    .catch((error) => {
      console.log(error.response);
      return [];
    });
};

export default {
  getInvestmentInLoan,
  getDashboardInvestments,
};
