import axios from "axios";
import { BASE_URL } from "../config/env";

export const publicApi = axios.create({
  baseURL: BASE_URL,
});

export const authApi = (token) =>
  axios.create({
    baseURL: BASE_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
