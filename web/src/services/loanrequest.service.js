import axios from "axios";

const instance = axios.create({
  baseURL: "https://tuichain-backend.herokuapp.com/api/loanrequests",
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

const createLoanRequest = (school, course, amount) => {
  return instance
    .post("/new/", {
      school,
      course,
      amount,
    })
    .then(() => {
      return true;
    })
    .catch((error) => {
      // TODO : why is error overwritten in browser? we need to catch a specific error
      console.log(error);
      return false;
    });
};

const getLoanRequests = () => {
  return instance
    .get("/get_all/")
    .then((response) => {
      return response.data.loanrequest;
    })
    .catch((error) => {
      console.log(error);
      return false;
    });
};

const getLoanRequest = (id) => {
  return instance.get("/get/"+id+"/")
    .then(response=>{
      return(response.data.loan_request);
    })
    .catch((error) => {
      console.log(error);
      return false;
    });
};


export default {
  createLoanRequest,
  getLoanRequests,
  getLoanRequest
};
