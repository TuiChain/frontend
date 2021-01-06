import axios from "axios";

const instance = axios.create({
  baseURL: "https://tuichain-backend.herokuapp.com/api/investments",
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

const investmentsHardCoded = [
  { 
    id:0,
    loan:'Loan to Zé',
    tokens:142,
    phase:'active',
    inMarketplace:40
  },
  {
    id:1,
    loan:'Loan to Quim',
    tokens:22,
    phase:'funding',
    inMarketplace:0
  },
  {
    id:2,
    loan:'Loan to Manel',
    tokens:42,
    phase:'completed',
    inMarketplace:0
  }
]

const getPersonal = () => {
  // return instance
  //   .get("/get_personal/")
  //   .then(() => {
  //     return true;
  //   })
  //   .catch((error) => {
  //     // TODO : why is error overwritten in browser? we need to catch a specific error
  //     console.log(error);
  //     return false;
  //   });
  return investmentsHardCoded;
};

export default {
  getPersonal
};
