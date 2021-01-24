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
    });
};

const getPendingLoans = async () => {
  const loans = await getAllLoans();
  return loans.filter((e) => e.state.toUpperCase() == "PENDING");
};

const getAllLoans = () => {
  return instance
    .get("/get_all/")
    .then((response) => {
      return response.data.loans;
    })
    .catch((error) => {
      console.error(error.response);
      return [];
    });
};

const validateLoan = (id, days_to_expiration, funding_fee, payment_fee) => {
  return instance
    .put(`/validate/${id}/`, {
      days_to_expiration,
      funding_fee_atto_dai_per_dai: (
        BigInt(funding_fee) *
        BigInt(10) ** BigInt(16)
      ).toString(),
      payment_fee_atto_dai_per_dai: (
        BigInt(payment_fee) *
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

      loan.requested_value = Number(
        BigInt(loan.requested_value_atto_dai) / BigInt(10 ** 18)
      );

      loan.funded_value = loan.funded_value_atto_dai
        ? Number(BigInt(loan.funded_value_atto_dai) / BigInt(10 ** 18))
        : 0;

      return loan;
    })
    .catch((error) => {
      console.log(error);
      return false;
    });
};

const getActiveLoan = () => {
  return instance
    .get(`/get_personal/`)
    .then((response) => {
      const loans = response.data.loans;
      const filtered = loans.filter((loan) =>
        ["PENDING", "FUNDING", "ACTIVE"].includes(loan.state.toUpperCase())
      );
      if (filtered.length > 0) {
        const loan = filtered[0];

        loan.requested_value = Number(
          BigInt(loan.requested_value_atto_dai) / BigInt(10 ** 18)
        );

        loan.funded_value = loan.funded_value_atto_dai
          ? Number(BigInt(loan.funded_value_atto_dai) / BigInt(10 ** 18))
          : 0;

        return loan;
      }
      return false;
    })
    .catch((error) => {
      console.log(error.response);
    });
};

const getFundingLoans = () => {
  return instance
    .get("/get_state/FUNDING/1")
    .then((response) => {
      return response.data.loans;
    })
    .catch((error) => {
      console.log(error);
      return false;
    });
};

// TODO
const getActiveLoans = () => {
  return instance
    .get(`/get_state/ACTIVE/1/`)
    .then((response) => {
      let loans = response.data.loans;

      loans.forEach((loan) => {
        loan.requested_value = Number(
          BigInt(loan.requested_value_atto_dai) / BigInt(10 ** 18)
        );

        loan.funded_value = loan.funded_value_atto_dai
          ? Number(BigInt(loan.funded_value_atto_dai) / BigInt(10 ** 18))
          : 0;

        loan.current_value = loan.current_value_atto_dai
          ? Number(BigInt(loan.current_value_atto_dai) / BigInt(10 ** 18))
          : 0;
      });

      return loans;
    })
    .catch((error) => {
      console.log(error.response);
      return [];
    });
};

// TODO
const getFeaturedLoans = () => {
  return instance
    .get(`/get_state/ACTIVE/1/`)
    .then((response) => {
      let loans = response.data.loans;

      // Get top 3
      loans = loans.slice(0, 3);

      loans.forEach((loan) => {
        loan.requested_value = Number(
          BigInt(loan.requested_value_atto_dai) / BigInt(10 ** 18)
        );

        loan.funded_value = loan.funded_value_atto_dai
          ? Number(BigInt(loan.funded_value_atto_dai) / BigInt(10 ** 18))
          : 0;
      });

      return loans;
    })
    .catch((error) => {
      console.log(error.response);
      return [];
    });
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

      return loans;
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
  getFeaturedLoans,
  getFundingLoans,
  getActiveLoans,
  getStudentLoans,
};
