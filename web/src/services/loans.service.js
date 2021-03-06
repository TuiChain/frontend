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
      requested_value_atto_dai: (BigInt(amount) * 10n ** 18n).toString(),
      description,
      destination,
      recipient_address,
    })
    .then((response) => {
      return response.data.loan;
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
        10n ** 16n
      ).toString(),
      payment_fee_atto_dai_per_dai: (
        BigInt(payment_fee) *
        10n ** 16n
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
        BigInt(loan.requested_value_atto_dai) / 10n ** 18n
      );

      loan.funded_value = loan.funded_value_atto_dai
        ? Number(BigInt(loan.funded_value_atto_dai) / 10n ** 18n)
        : 0;

      loan.funding_fee = loan.funding_fee_atto_dai_per_dai
        ? Number(BigInt(loan.funding_fee_atto_dai_per_dai) / 10n ** 16n) / 100
        : 0;

      loan.payment_fee = loan.payment_fee_atto_dai_per_dai
        ? Number(BigInt(loan.payment_fee_atto_dai_per_dai) / 10n ** 16n) / 100
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
          BigInt(loan.requested_value_atto_dai) / 10n ** 18n
        );

        loan.funded_value = loan.funded_value_atto_dai
          ? Number(BigInt(loan.funded_value_atto_dai) / 10n ** 18n)
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
    .get("/get_state/FUNDING/1/")
    .then((response) => {
      console.log(response);
      return response.data.loans;
    })
    .catch((error) => {
      console.log(error);
      return [];
    });
};

// TODO
const getActiveLoans = () => {
  return instance
    .get(`/get_state/ACTIVE/1/`)
    .then((response) => {
      let loans = response.data.loans;

      loans.forEach((loan) => {
        loan.requested_value =
          Number(BigInt(loan.requested_value_atto_dai) / 10n ** 16n) / 100;

        loan.funded_value = loan.funded_value_atto_dai
          ? Number(BigInt(loan.funded_value_atto_dai) / 10n ** 16n) / 100
          : 0;

        loan.current_value = loan.current_value_atto_dai
          ? Number(BigInt(loan.current_value_atto_dai) / 10n ** 16n) / 100
          : 0;
      });

      return loans;
    })
    .catch((error) => {
      console.log(error);
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
          BigInt(loan.requested_value_atto_dai) / 10n ** 18n
        );

        loan.funded_value = loan.funded_value_atto_dai
          ? Number(BigInt(loan.funded_value_atto_dai) / 10n ** 18n)
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
          Number(BigInt(loan.requested_value_atto_dai) / 10n ** 16n) / 100;

        loan.funded_value = loan.funded_value_atto_dai
          ? Number(BigInt(loan.funded_value_atto_dai) / 10n ** 16n) / 100
          : 0;
      });

      return loans;
    })
    .catch((error) => {
      console.log(error.response);
      return [];
    });
};

const cancelLoan = (id) => {
  return instance.put(`/cancel/${id}/`).then((response) => {
    console.log("Canceled: ", response.data.message);
    return true;
  });
};

const withdrawLoanRequest = (id) => {
  return instance.put(`/user_withdraw/${id}/`).then((response) => {
    console.log("Withdrawn: ", response.data.message);
    return true;
  });
};

const finalizeLoan = (id) => {
  return instance
    .put(`/finalize/${id}/`)
    .then((response) => {
      console.log("Finalized: ", response.data.message);
      return true;
    })
    .catch((error) => {
      console.log(error.response);
      return false;
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
  getActiveLoans,
  getFundingLoans,
  getStudentLoans,
  cancelLoan,
  withdrawLoanRequest,
  finalizeLoan,
};
