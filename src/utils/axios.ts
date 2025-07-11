import axios from "axios";
import { ACCESS_TOKEN, BASE_API } from "./api";

const instance = axios.create({
  baseURL: BASE_API,
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${ACCESS_TOKEN}`;
  return config;
});

export default instance;
