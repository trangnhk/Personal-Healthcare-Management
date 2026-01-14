import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApi } from "./Apis";
import { endpoints } from "./Endpoints";

export const getCurrentUser = async () =>{
    const token = await AsyncStorage.getItem("token");

    return authApi(token).get(endpoints.currentUser);
}

export const patchProfile = async (userId, data) => {
    const token = await AsyncStorage.getItem("token");

    return authApi(token).patch(
        endpoints.userEdit(userId),
        data,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );
};
