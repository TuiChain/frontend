import axios from "axios";

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL
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
  } catch(error) {
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
function changeAccounts(setWallet) {
  try {

    const ethereum = checkConnection();

    ethereum.on("accountsChanged", function (accounts) {
      setWallet(accounts[0]);
      suggestDAI();
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
async function suggestToken(tokenAddress, tokenSymbol, tokenDecimals, tokenImage) {

  const ethereum = checkConnection();

  try {

    return await ethereum.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
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
  }
}

/**
 * Function that suggests adding DAI to an account
 */
async function suggestDAI() {

  const tuichain_info = await requestBlockchainInfo();

  // in case some error occurs
  if (tuichain_info == false) {
    return;
  }

  if (tuichain_info.dai_contract_address != null) {
    
    suggestToken(
      tuichain_info.dai_contract_address, 
      "DAI", 
      18, 
      'https://i.ibb.co/FD8YxCb/dai.png'
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

export default {
  checkAccount,
  connectToWallet,
  changeAccounts,
  suggestDAI,
  requestBlockchainInfo // to remove when used
};
