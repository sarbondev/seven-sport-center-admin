export const BASE_URL = "http://localhost:3001/api";
const token = localStorage.getItem("token") || "";

export const fetcher = (url: string) =>
  fetch(`${BASE_URL}${url}`, {
    headers: {
      Authorization: `${token}`,
    },
  }).then((res) => res.json());
