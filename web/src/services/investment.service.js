import axios from "axios";

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

const newInvestment = (inv) => {
  return instance
    .post("/new/", inv)
    .then(function () {
      return true;
    })
    .catch((error) => {
      console.log(error);
      return false;
    });
};


// const investmentsHardCoded = [
//   { 
//     id:0,
//     loan:'Loan to Zé',
//     tokens:142,
//     phase:'active',
//     inMarketplace:40
//   },
//   {
//     id:1,
//     loan:'Loan to Quim',
//     tokens:22,
//     phase:'funding',
//     inMarketplace:0
//   },
//   {
//     id:2,
//     loan:'Loan to Manel',
//     tokens:42,
//     phase:'finalized',
//     inMarketplace:0
//   },
//   {
//     id:3,
//     loan:'Loan to Ventura',
//     tokens:422,
//     phase:'expired',
//     inMarketplace:0
//   }
// ]

const getPersonal = (userAddr) => {
  return instance
    .get(`/get_personal/${userAddr}/`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      // TODO : why is error overwritten in browser? we need to catch a specific error
      console.log(error);
      return false;
    });
  //return investmentsHardCoded;
};

export default {
  newInvestment,
  getPersonal
};
