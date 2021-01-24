import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

const instance = axios.create({
  baseURL: `${API_URL}/loans/documents`,
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
  const data = new FormData();
  data.append("id", id);
  data.append("document", document);
  data.append("name", name);
  data.append("is_public", Number(is_public));

  return instance
    .post(`/upload_document/${id}/`, data)
    .then(() => {
      return true;
    })
    .catch((error) => {
      console.log(error.response);
      return false;
    });
};

const getLoanPublicDocuments = (id) => {
  return instance
    .get(`/get_approved_public_docs/${id}/`)
    .then((response) => {
      return response.data.documents;
    })
    .catch((error) => {
      console.log(error.response);
      return [];
    });
};

const getPendingDocuments = () => {
  return instance
    .get(`/get_all_unevaluated/`)
    .then((response) => {
      return response.data.documents;
    })
    .catch((error) => {
      console.log(error.response);
      return [];
    });
};

const validateDocument = (id) => {
  return instance
    .put(`/approve_document/${id}/`)
    .then(() => {
      return true;
    })
    .catch((error) => {
      console.log(error.response);
      return false;
    });
};

const rejectDocument = (id) => {
  return instance
    .put(`/reject_document/${id}/`)
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
  getLoanPublicDocuments,
  getPendingDocuments,
  validateDocument,
  rejectDocument,
};
