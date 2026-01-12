import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApi } from "./Apis";
import { endpoints } from "./Endpoints";

export const getWorkoutPlan = async (cursor = null) => {
    
    if (cursor)
        url = cursor.replace(BASE_URL, "");

    const token = await AsyncStorage.getItem("token");

    
    return authApi(token).get(endpoints.workoutplans);
};