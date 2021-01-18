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

/**
 * Function that allows user to provide funds to a loan.
 *
 * @param { String } loan_identifier The id's loan identifier
 * @param { Number } tokens The number of tokens that user want to invest
 *
 * @returns Boolean that represents if the chain was correct
 */
async function provideFunds(loan_identifier, tokens) {
  let post = {
    value_atto_dai: (BigInt(tokens) * BigInt(10) ** BigInt(18)).toString(),
    loan_id: loan_identifier,
  };

  return await walletTransaction("/provide_funds/", post);
}

/**
 * Function that allows user to withdraw funds previously provided to a loan.
 *
 * @param { String } loan_identifier The id's loan identifier
 * @param { Number } tokens The number of tokens that user want to withdraw
 *
 * @returns Boolean that represents if the chain was correct
 */
async function withdrawFunds(loan_identifier, tokens) {
  let post = {
    value_atto_dai: (BigInt(tokens) * BigInt(10) ** BigInt(18)).toString(),
    loan_id: loan_identifier,
  };

  return await walletTransaction("/withdraw_funds/", post);
}

/**
 * Function that allows user to make a payment to the loan.
 *
 * @param { String } loan_identifier The id's loan identifier
 * @param { Number } tokens The number of tokens that user want to payback
 *
 * @returns Boolean that represents if the chain was correct
 */
async function makePayment(loan_identifier, tokens) {
  let post = {
    value_atto_dai: (BigInt(tokens) * BigInt(10) ** BigInt(18)).toString(),
    loan_id: loan_identifier,
  };

  return await walletTransaction("/make_payment/", post);
}

/**
 * Function that allows user to redeem tokens previously obtained by funding the loan.
 *
 * @param { String } loan_identifier The id's loan identifier
 * @param { Number } tokens The number of tokens that user want to redeem
 *
 * @returns Boolean that represents if the chain was correct
 */
async function redeemTokens(loan_identifier, tokens) {
  let post = {
    amount_tokens: tokens,
    loan_id: loan_identifier,
  };

  return await walletTransaction("/redeem_tokens/", post);
}

/**
 * Generic function to execute transactions in the wallet
 *
 * @param { String } api_route API route to consume
 * @param {*} post_params Parameters needed for post
 *
 * @returns Boolean that represents if the chain was correct
 */
async function walletTransaction(api_route, post_params) {
  return instance
    .post(api_route, post_params)
    .then(async (response) => {
      return await WalletService.sendTransactions(response.data.transactions);
    })
    .catch((error) => {
      console.log(error);
    });
}

export default {
  provideFunds,
  withdrawFunds,
  makePayment,
  redeemTokens,
};
