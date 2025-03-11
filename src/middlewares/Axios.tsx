import axios from "axios";

const token = localStorage.getItem("ssctoken") || "";

export const Axios = axios.create({
  baseURL: "http://localhost:3001/api/",
  headers: {
    Authorization: token,
  },
});
