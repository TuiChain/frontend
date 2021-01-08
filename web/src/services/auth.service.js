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
      localStorage.setItem("is_admin", response.data.is_admin);
      return { token: response.data.token, is_admin: response.data.is_admin };
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
      localStorage.setItem("is_admin", response.data.is_admin);
      return { token: response.data.token, is_admin: response.data.is_admin };
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
  const token = localStorage.getItem("user_token");
  const is_admin = localStorage.getItem("is_admin") === "true";

  if (token) {
    return {
      user_token: token,
      is_admin: is_admin,
    };
  }

  return false;
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
