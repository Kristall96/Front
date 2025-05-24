// src/api/axios.js
import axios from "axios";

const secureAxios = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // send/receive cookies (for refreshToken)
});
console.log("✔️ Axios baseURL:", import.meta.env.VITE_API_URL);
console.log("✔️ Axios withCredentials:", import.meta.env.VITE_API_URL);
export default secureAxios;
