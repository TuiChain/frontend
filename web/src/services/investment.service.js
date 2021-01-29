import axios from "axios";
import Web3 from "web3";

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

const getInvestmentInLoan = (loan_id, account_address) => {
  const account = Web3.utils.toChecksumAddress(account_address);

  return instance
    .get("/get/" + loan_id + "/" + account + "/")
    .then((response) => {
      return response.data.investment;
    })
    .catch((error) => {
      console.log(error);
    });
};

// Investments for dashboard - limits 3
const getDashboardInvestments = (account_address) => {
  const account = Web3.utils.toChecksumAddress(account_address);

  return instance
    .get(`/get_personal/${account}/`)
    .then((response) => {
      console.log(response);
      let investments = response.data.investments;

      // TODO WAIT BACKEND TO CHANGE NAME
      investments = investments.slice(0, 3);

      investments.forEach((investment) => {
        investment.loan.requested_value = Number(
          BigInt(investment.loan.requested_value_atto_dai) / 10n ** 18n
        );

        investment.loan.funded_value = investment.loan.funded_value_atto_dai
          ? Number(BigInt(investment.loan.funded_value_atto_dai) / 10n ** 18n)
          : 0;
      });

      return investments;
    })
    .catch((error) => {
      console.error(error);
      return [];
    });
};

const getPersonal = (accountAddress) => {
  const account = Web3.utils.toChecksumAddress(accountAddress);

  return instance
    .get(`/get_personal/${account}/`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.log(error);
      return false;
    });
};

const getLoanSellPositions = (id) => {
  return instance
    .get(`/get/${id}/`)
    .then((response) => {
      const sell_positions = response.data.investment.sell_positions;
      sell_positions.forEach((p, index) => {
        p.id = index;

        console.log(
          "price BIG INT",
          Number(BigInt(p.price_atto_dai_per_token) / BigInt(10 ** 16)) / 100
        );
        p.price_per_token =
          Number(BigInt(p.price_atto_dai_per_token) / BigInt(10 ** 16)) / 100;
      });
      // TODO - REMOVE
      // sell_positions[1] = JSON.parse(JSON.stringify(sell_positions[0]));
      // sell_positions[1].id = 1;
      // console.log("Positions:", sell_positions);

      return sell_positions;
    })
    .catch((error) => {
      console.log(error);
      return [];
    });
};

export default {
  getPersonal,
  getInvestmentInLoan,
  getDashboardInvestments,
  getLoanSellPositions,
};
