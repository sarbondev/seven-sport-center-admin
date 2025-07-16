import { BASE_URL } from "../lib/API";

const token = localStorage.getItem("ssctoken") || "";

export const fetcher = (url: string) =>
  fetch(`${BASE_URL}${url}`, {
    headers: {
      Authorization: `${token}`,
    },
  }).then((res) => res.json());
