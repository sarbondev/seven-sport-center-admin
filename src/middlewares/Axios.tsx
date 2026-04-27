import axios from "axios";
import { BASE_URL } from "../lib/API";

export const Axios = axios.create({
  baseURL: BASE_URL,
});

Axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("ssctoken");

  if (token) {
    config.headers.Authorization = token;
  } else if (config.headers.Authorization) {
    delete config.headers.Authorization;
  }

  return config;
});
