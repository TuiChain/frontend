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

  ethereum.on("accountsChanged", function (accounts) {
    setWallet(accounts[0]);
  });
}

/**
 * 
 * 
 * @param { String } tokenAddress The address that the token is at.
 * @param { String } tokenSymbol A ticker symbol or shorthand, up to 5 chars.
 * @param { Number } tokenDecimals The number of decimals in the token
 * @param { String } tokenImage A string url of the token logo
 */
function suggestToken(tokenAddress, tokenSymbol, tokenDecimals, tokenImage) {
  try {
    const wasAdded = await ethereum.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20', // Initially only supports ERC20, but eventually more!
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

export default {
  checkAccount,
  connectToWallet,
  changeAccounts,
};
