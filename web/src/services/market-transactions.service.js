import axios from "axios";
import WalletService from "./wallet.service";

const API_URL = process.env.REACT_APP_API_URL;

const instance = axios.create({
  baseURL: `${API_URL}/market/transactions`,
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
 * @param { Number } loanIdentifier The id's loan identifier
 * @param { Number } amountTokens The number of tokens that user want to invest
 * @param { Number } price The price of each token
 */
async function createSellPosition(loanIdentifier, amountTokens, price) {
  let post = {
    price_atto_dai_per_token: (BigInt(Math.floor(price*100)) * BigInt(10) ** BigInt(16)).toString(),
    loan_id: loanIdentifier,
    amount_tokens: amountTokens.toString()
  };

  await walletTransaction("/create_sell_position/", post);
}

/**
 * Function that allows user to decrease the price of his sell position
 *
 * @param { Number } loanIdentifier The id's loan identifier
 * @param { Number } decreaseAmount The number of tokens that user want to decrease
 */
async function decreaseSellPositionAmount(loanIdentifier, decreaseAmount) {
  let post = {
    loan_id: loanIdentifier,
    decrease_amount: decreaseAmount.toString()
  };

  await walletTransaction("/decrease_sell_position_amount/", post);
}

/**
 * Function that allows user to increase the price of his sell position
 *
 * @param { Number } loanIdentifier The id's loan identifier
 * @param { Number } increaseAmount The number of tokens that user want to increase
 */
async function increaseSellPositionAmount(loanIdentifier, increaseAmount) {
  let post = {
    loan_id: loanIdentifier,
    increase_amount: increaseAmount.toString()
  };

  await walletTransaction("/increase_sell_position_amount/", post);
}

/**
 * Function that allows user to update the price of his sell position
 * @param { Number } loanIdentifier The id's loan identifier
 * @param { Number } price The price of each token
 */
async function updateSellPositionPrice(loanIdentifier, price) {
  let post = {
    loan_id: loanIdentifier,
    new_price_atto_dai_per_token: (BigInt(Math.floor(price*100)) * BigInt(10) ** BigInt(16)).toString()
  };

  await walletTransaction("/update_sell_position_price/", post);
}

/**
 * Function that allows user to remove the sell
 * @param { Number } loanIdentifier The id's loan identifier
 */
async function removeSellPosition(loanIdentifier) {
  let post = {
    loan_id: loanIdentifier,
  };

  await walletTransaction("/remove_sell_position/", post);
}

/**
 * Generic function to execute transactions in the wallet
 *
 * @param { String } api_route API route to consume
 * @param {*} post_params Parameters needed for post
 *
 */
async function walletTransaction(api_route, post_params) {
  return instance.post(api_route, post_params).then(async (response) => {
    await WalletService.sendTransactions(response.data.transactions);
  });
}

function priceAttoDaiToFloat(priceAttoDai) {
  return Number(BigInt(priceAttoDai) / BigInt(10) ** BigInt(16)) / 100
}

export default {
  createSellPosition,
  decreaseSellPositionAmount,
  increaseSellPositionAmount,
  updateSellPositionPrice,
  removeSellPosition,
  priceAttoDaiToFloat
};
