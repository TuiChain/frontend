
/**
 * Function that checks if metamask exists.
 * 
 * @returns The ethereum property of a widow, or an error
 */
function checkConnection() {

  const { ethereum } = window;

  if(!ethereum) {
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

  return ethereum.selectedAddress

}

/**
 * Function for establish a connection with Metamask
 */
async function connectToWallet() {

  const ethereum = checkConnection();

  if(checkAccount() == null) {

    try {

      await ethereum.send('eth_requestAccounts');
      
    } catch (error) {
      console.log(error);
      //return connectToWallet()
    }

  } else {

    console.log('account: ' + ethereum.selectedAddress);

  }

}

/**
 * Function that listens account changing
 * 
 * @param setWallet Function to change the connected wallet account
 */
function changeAccounts(setWallet) {

  const ethereum = checkConnection();

  ethereum.on('accountsChanged', function (accounts) {
    
    setWallet(accounts[0]);

  });
  
}

export default {
  checkAccount,
  connectToWallet,
  changeAccounts
};

