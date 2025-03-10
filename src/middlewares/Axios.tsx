import axios from "axios";

const token = localStorage.getItem("token");

export const Axios = axios.create({
  baseURL: "http://localhost:3000/api/",
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
