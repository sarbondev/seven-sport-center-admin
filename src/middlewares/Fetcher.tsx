import { BASE_URL } from "../lib/API";

export const fetcher = (url: string) =>
  fetch(`${BASE_URL}${url}`, {
    headers: {
      Authorization: localStorage.getItem("ssctoken") || "",
    },
  }).then((res) => res.json());
