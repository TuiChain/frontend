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
  const ethereum = checkConnection();

  return ethereum.selectedAddress;
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
  const ethereum = checkConnection();

  //var suggestion = false;

  ethereum.on("accountsChanged", function (accounts) {

    /*
    if(!suggestion) {
      suggestDAI();
      suggestion = true;
    }*/

    suggestDAI();

    setWallet(accounts[0]);
  });
}

/**
 * Function that suggest adding a token to user's wallet
 * 
 * @param { String } tokenAddress The address that the token is at
 * @param { String } tokenSymbol A ticker symbol or shorthand, up to 5 chars
 * @param { Number } tokenDecimals The number of decimals in the token
 * @param { String } tokenImage A string url of the token logo
 */
async function suggestToken(tokenAddress, tokenSymbol, tokenDecimals, tokenImage) {

  const ethereum = checkConnection();

  try {
    const wasAdded = await ethereum.request({
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
  
    if (wasAdded) {
      console.log('Thanks for your interest!');
    } else {
      console.log('Your loss!');
    }
  } catch (error) {
    console.log(error);
  }
}

function suggestDAI() {
  // request to backend info with axios

  suggestToken(
    "0x6b175474e89094c44da98b954eedeac495271d0f",
    "DAI",
    18,
    "./public/favicon.ico"
    );
}

export default {
  checkAccount,
  connectToWallet,
  changeAccounts,
  suggestDAI,
  suggestToken
};
