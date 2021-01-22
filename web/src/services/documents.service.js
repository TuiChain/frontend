import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

const instance = axios.create({
  baseURL: `${API_URL}/loans`, // TODO
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

const uploadDocument = (id, name, document, is_public) => {
  console.log({
    id,
    document,
    name,
    is_public,
  });

  return instance
    .post(`${id}/documents/`, {
      is_public,
      document,
      name,
    })
    .then(() => {
      return true;
    })
    .catch((error) => {
      console.log(error.response);
      return false;
    });
};

const validateDocument = (id) => {
  console.log("accept", id);

  return instance
    .put(`${id}/documents/`)
    .then(() => {
      return true;
    })
    .catch((error) => {
      console.log(error.response);
      return false;
    });
};

const rejectDocument = (id) => {
  console.log("to cancel", id);

  return instance
    .put(`${id}/documents/`)
    .then(() => {
      return true;
    })
    .catch((error) => {
      console.log(error.response);
      return false;
    });
};

export default {
  uploadDocument,
  acceptDocument: validateDocument,
  rejectDocument,
};
