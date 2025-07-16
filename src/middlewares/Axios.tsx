import axios from "axios";
import { BASE_URL } from "../lib/API";

const token = localStorage.getItem("ssctoken") || "";

export const Axios = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: token,
  },
});
