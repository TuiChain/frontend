import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

const signup = (username, password, email, first_name, last_name) => {
  return axios
    .post(API_URL + "/auth/signup/", {
      username,
      password,
      email,
      first_name,
      last_name,
    })
    .then((response) => {
      localStorage.setItem("user_token", response.data.token);
      return response.data.token;
    })
    .catch(() => {
      return false;
    });
};

const login = (username, password) => {
  return axios
    .post(API_URL + "/auth/login/", {
      username,
      password,
    })
    .then((response) => {
      localStorage.setItem("user_token", response.data.token);
      return response.data.token;
    })
    .catch(() => {
      return false;
    });
};

const logout = () => {
  localStorage.removeItem("user_token");
  return false;
};

const getCurrentUser = () => {
  return localStorage.getItem("user_token");
};

const checkEmail = (email) => {
  return axios
    .post(API_URL + "/auth/verify_email/", {
      email,
    })
    .then(() => {
      return true;
    })
    .catch(() => {
      return false;
    });
};

const checkUsername = (username) => {
  return axios
    .post(API_URL + "/auth/verify_username/", {
      username,
    })
    .then(() => {
      return true;
    })
    .catch(() => {
      return false;
    });
};

export default {
  signup,
  login,
  logout,
  getCurrentUser,
  checkEmail,
  checkUsername,
};
