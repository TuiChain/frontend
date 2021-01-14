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
      const account = WalletService.checkAccount();
      let transactionParameters = [];

      response.data.transactions.forEach(element => {
        const params = {
          to: element.to, 
          data: element.data,
          from: account
        };
        transactionParameters.push(params);
      });

      console.log('provide_funds: ', transactionParameters);
      WalletService.sendTransactions(transactionParameters);
    })
    .catch((error) => {
      console.log(error);
    });
  
}

export default {
  provide_funds
};
