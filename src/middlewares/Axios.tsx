import axios from "axios";

const token = localStorage.getItem("ssctoken") || "";

export const Axios = axios.create({
  // baseURL: "http://localhost:3000/api/",
  // baseURL: "https://seven-sport-center-server.onrender.com/api/",
  baseURL: "https://server.7sportcenter.uz/api/",
  headers: {
    Authorization: token,
  },
});
