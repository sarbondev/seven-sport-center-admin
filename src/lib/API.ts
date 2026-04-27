const DEFAULT_BASE_URL = "http://localhost:3000/api/";

export const BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.trim() || DEFAULT_BASE_URL;
