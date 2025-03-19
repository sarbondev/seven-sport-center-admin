import axios from "axios";

const token = localStorage.getItem("ssctoken") || "";

export const Axios = axios.create({
  // baseURL: "http://localhost:3001/api/",
  baseURL: "https://seven-sport-center-server.onrender.com/api/",
  headers: {
    Authorization: token,
  },
});
