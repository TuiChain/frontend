import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

const instance = axios.create({
  baseURL: API_URL,
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

const startIdentityVerification = () => {
  return instance
    .get("/external/create_verification_intent/")
    .then(function (result) {
      return result;
    })
    .catch((error) => {
      console.log(error);
      return false;
    });
};

const getVerificationResult = (verification_intent_id) => {
  return instance
    .get(`/external/get_verification_intent/${verification_intent_id}`)
    .then(function (result) {
      return result;
    })
    .catch((error) => {
      console.log(error);
      return false;
    });
};

export default {
  startIdentityVerification,
  getVerificationResult,
};
