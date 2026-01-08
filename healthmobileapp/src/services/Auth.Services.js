import { publicApi, authApi } from "./Apis";
import { endpoints } from "./Endpoints";

export const login = (data) =>
  publicApi.post(endpoints.login, data);

export const getCurrentUser = (token) =>
  authApi(token).get(endpoints.currentUser);
