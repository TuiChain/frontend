import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

const instance = axios.create({
  baseURL: `${API_URL}/users`,
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

const getUserInfo = (id) => {
  return instance
    .get("/get/" + id + "/")
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log(error);
      return false;
    });
};

const getCurrentUserInfo = () => {
  return instance
    .get("/get/")
    .then((response) => {
      return [response.data.user, response.data.id_verification];
    })
    .catch((error) => {
      console.log(error);
      return false;
    });
};

const updateInfo = (info) => {
  return instance
    .put("/update_profile/", info)
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });
};

export default {
  getUserInfo,
  getCurrentUserInfo,
  updateInfo,
};
