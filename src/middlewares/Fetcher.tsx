// export const BASE_URL = "http://localhost:3001/api";
export const BASE_URL = "https://seven-sport-center-server.onrender.com/api";
const token = localStorage.getItem("ssctoken") || "";

export const fetcher = (url: string) =>
  fetch(`${BASE_URL}${url}`, {
    headers: {
      Authorization: `${token}`,
    },
  }).then((res) => res.json());
