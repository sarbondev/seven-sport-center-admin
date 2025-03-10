import axios from "axios";

const token = localStorage.getItem("token") || "";

export const Axios = axios.create({
  baseURL: "http://localhost:3001/api/",
  headers: {
    Authorization: token,
  },
});
