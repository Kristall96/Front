// src/api/axios.js
import axios from "axios";

const secureAxios = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/api",
  withCredentials: true, // send/receive cookies (for refreshToken)
});

export default secureAxios;
