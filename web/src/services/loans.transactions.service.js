import axios from "axios";
import WalletService from "./wallet.service";

const API_URL = process.env.REACT_APP_API_URL;

const instance = axios.create({
  baseURL: `${API_URL}/loans/transactions`,
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

async function provide_funds(loan_identifier, tokens) {


  let post = {
    value_atto_dai: (BigInt(tokens) * (BigInt(10) ** BigInt(18))).toString(),
    loan_id: loan_identifier,
  };

  return instance
    .post("/provide_funds/", post)
    .then((response) => {
      WalletService.sendTransactions(response.data.transactions);
    })
    .catch((error) => {
      console.log(error);
    });
  
}

export default {
  provide_funds
};
