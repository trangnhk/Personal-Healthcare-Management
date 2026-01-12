import { publicApi, authApi } from "./Apis";
import { endpoints } from "./Endpoints";
import { Buffer } from "buffer";

export const login = (data) => {
  const form = new URLSearchParams();

  form.append("username", data.username);
  form.append("password", data.password);
  form.append("grant_type", "password");

  const basicAuth = Buffer
    .from(`${data.client_id}:${data.client_secret}`)
    .toString("base64");

  return publicApi.post(
    endpoints.login,
    form,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Basic ${basicAuth}`
      }
    }
  );
};

export const getCurrentUser = (token) =>
  authApi(token).get(endpoints.currentUser);