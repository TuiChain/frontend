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
  return instance.post("/new/",inv).then(function (response) {
    console.log(response);
  })
}


export default {
  newInvestment
};
