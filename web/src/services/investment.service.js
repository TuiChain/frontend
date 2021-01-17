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
  return instance.post("/new/", inv).then(function (response) {
    console.log(response);
  });
};

// TODO
const getInvestments = () => {
  return [
    {
      loan: {
        id: 4,
        student: 2,
        request_date: "12/12/21",
        school: "Universidade do minho",
        course: "Mestrado Engenharia Informática",
        destination: "Portugal",
        requested_value_atto_dai: "80000000000000000000",
        description: "ESTE É O MEU SONHO :)",
        state: "Pending",
        recipient_address: "idk",
        identifier: "idk",
      },
      name: "Pedro Moreira",
      nrTokens: 200,
    },
    {
      loan: {
        id: 5,
        student: 23,
        request_date: "12/12/21",
        school: "Universidade do Porto",
        course: "Mestrado da Vida",
        destination: "Portugal",
        requested_value_atto_dai: "80000000000000000000",
        description: "ESTE É O MEU SONHO :)",
        state: "Pending",
        recipient_address: "idk",
        identifier: "idk",
      },
      name: "Moreira Pedro",
      nrTokens: 200,
    },
  ];
};

export default {
  newInvestment,
  getInvestments,
};
