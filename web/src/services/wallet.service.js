import axios from "axios";
import Constants from "../constants";

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

/**
 * Function that checks if metamask exists.
 *
 * @returns The ethereum property of a widow, or an error
 */
function checkConnection() {
  const { ethereum } = window;

  if (!ethereum) {
    throw new Error("Metamask not found");
  }

  return ethereum;
}

/**
 * Function for checking if an account is connected
 *
 * @returns The selected account of the connected wallet
 */
function checkAccount() {
  try {
    const ethereum = checkConnection();
    return ethereum.selectedAddress;
  } catch (error) {
    return 0;
  }
}

/**
 * Function for establish a connection with Metamask
 */
async function connectToWallet() {
  const ethereum = checkConnection();

  if (checkAccount() == null) {
    try {
      await ethereum.send("eth_requestAccounts");
    } catch (error) {
      console.log(error);
    }
  } else {
    console.log("account: " + ethereum.selectedAddress);
  }
}

/**
 * Function that listens account changing
 *
 * @param { Function } setWallet Function to change the connected wallet account state
 */
async function changeAccounts(setWallet) {
  try {
    const ethereum = checkConnection();
    const tuichain_info = await requestBlockchainInfo();

    ethereum.on("accountsChanged", (accounts) => {
      setWallet(accounts[0]);
      suggestDAI(ethereum, tuichain_info);
    });

    ethereum.on("chainChanged", () => {
      suggestDAI(ethereum, tuichain_info);
    });
  } catch (error) {
    return;
  }
}

/**
 * Function that suggest adding a token to user's wallet
 *
 * @param { String } tokenAddress The address that the token is at
 * @param { String } tokenSymbol A ticker symbol or shorthand, up to 5 chars
 * @param { Number } tokenDecimals The number of decimals in the token
 * @param { String } tokenImage A string url of the token logo
 *
 * @returns Boolean which represents if a suggestion was taken or not.
 */
async function suggestToken(
  tokenAddress,
  tokenSymbol,
  tokenDecimals,
  tokenImage
) {
  const ethereum = checkConnection();

  try {
    return await ethereum.request({
      method: "wallet_watchAsset",
      params: {
        type: "ERC20",
        options: {
          address: tokenAddress,
          symbol: tokenSymbol,
          decimals: tokenDecimals,
          image: tokenImage,
        },
      },
    });
  } catch (error) {
    console.log(error);
    return false;
  }
}

/**
 * Function that suggests adding DAI to an account
 */
async function suggestDAI(ethereum, tuichain_info) {
  if (
    tuichain_info != false &&
    tuichain_info.dai_contract_address != null &&
    (tuichain_info.dai_contract_address !=
      "0x6B175474E89094C44Da98b954EedeAC495271d0F" ||
      tuichain_info.chain_id != 1) &&
    tuichain_info.chain_id == ethereum.chainId
  ) {
    suggestToken(
      tuichain_info.dai_contract_address,
      "DAI",
      18,
      Constants.dai_svg
    );
  }
}

/**
 * Function that makes a request to an API for blickchain information
 *
 * @returns Tuichain Blockchain information
 */
async function requestBlockchainInfo() {
  return instance
    .get("/tuichain/get_info/")
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log(error);
      return false;
    });
}

/**
 * Function that prepares a transaction for the user to accept in metamask
 * 
 * @param {Object} transactionsParameters Array of transactions parameters
 */
async function sendTransactions(transactionsParameters) {

  const ethereum = checkConnection();

  try {

    transactionsParameters.forEach(element => {
      ethereum.request({
        method: 'eth_sendTransaction',
        params: [element],
      });
    });

  } catch (error) {
    console.log(error);
  }
  
}

export default {
  checkAccount,
  connectToWallet,
  changeAccounts,
  suggestDAI,
  sendTransactions,
};
