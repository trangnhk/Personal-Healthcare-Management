import { endpoints } from "./Endpoints";

export const getCurrentUser = () =>{
    return authApi().get(endpoints.currentUser);
}