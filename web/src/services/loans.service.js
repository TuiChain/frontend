import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

const instance = axios.create({
  baseURL: `${API_URL}/loans`,
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

const createLoan = (
  school,
  course,
  amount,
  description,
  destination,
  recipient_address
) => {
  return instance
    .post("/new/", {
      school,
      course,
      requested_value_atto_dai: (
        BigInt(amount) *
        BigInt(10) ** BigInt(18)
      ).toString(),
      description,
      destination,
      recipient_address,
    })
    .then(() => {
      return true;
    })
    .catch((error) => {
      console.log(error.response);
      return false;
    });
};

const getPendingLoans = () => {
  return instance
    .get("/get_all/") // todo
    .then((response) => {
      console.log(response.data);
      return response.data.loans;
    })
    .catch((error) => {
      console.error(error.response);
      return [];
    });
};

const validateLoan = (id) => {
  return instance
    .put(`/validate/${id}/`, {
      days_to_expiration: 100,
      funding_fee_atto_dai_per_dai: (
        BigInt(10) *
        BigInt(10) ** BigInt(16)
      ).toString(),
      payment_fee_atto_dai_per_dai: (
        BigInt(10) *
        BigInt(10) ** BigInt(16)
      ).toString(),
    })
    .then((response) => {
      console.log("Validated: ", response.data.message);
      return true;
    })
    .catch((error) => {
      console.log(error.response);
      return false;
    });
};

const rejectLoan = (id) => {
  return instance
    .put(`/reject/${id}/`)
    .then((response) => {
      console.log("Closed: ", response.data.message);
      return true;
    })
    .catch((error) => {
      console.log(error.response);
      return false;
    });
};

const getLoan = (id) => {
  return instance
    .get("/get/" + id + "/")
    .then((response) => {
      const loan = response.data.loan;

      loan.requested_value = parseInt(loan.requested_value_atto_dai) / 10 ** 18;

      loan.funded_value = loan.funded_value_atto_dai
        ? parseInt(loan.funded_value_atto_dai) / 10 ** 18
        : 0;

      return loan;
    })
    .catch((error) => {
      console.log(error);
      return false;
    });
};

const getActiveLoan = () => {
  return {
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
  };
};

// TODO
const getLoans = () => {
  return [
    {
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
    {
      id: 5,
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
  ];
};

const getStudentLoans = () => {
  return instance
    .get(`/get_personal/`)
    .then((response) => {
      const loans = response.data.loans;
      loans.forEach((loan) => {
        loan.requested_value =
          parseInt(loan.requested_value_atto_dai) / 10 ** 18;

        loan.funded_value = loan.funded_value_atto_dai
          ? parseInt(loan.funded_value_atto_dai) / 10 ** 18
          : 0;
      });

      return response.data.loans;
    })
    .catch((error) => {
      console.log(error.response);
      return [];
    });
};

export default {
  createLoan,
  getPendingLoans,
  validateLoan,
  rejectLoan,
  getLoan,
  getActiveLoan,
  getLoans,
  getStudentLoans,
};
