import axios from "axios";

const API_URL =
  "https://my-json-server.typicode.com/pferreira101/tuichain_faker/students";

const getStudents = () => {
  return axios.get(API_URL).then((response) => {
    console.log("GET students");
    return response.data;
  });
};

export default getStudents;
