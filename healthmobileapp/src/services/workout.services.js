import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApi } from "./Apis";
import { endpoints } from "./Endpoints";
import { BASE_URL } from "../config/env";

export const getWorkoutPlan = async (cursor = null) => {
    let url = '/workout-plans/';
    if (cursor)
        url = cursor.replace(BASE_URL, "");

    const token = await AsyncStorage.getItem("token");

    
    return authApi(token).get(url);
};

export const createWorkoutPlan = async (data) => {
    const token = await AsyncStorage.getItem("token");
    return authApi(token).post(endpoints.workoutplans, data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

export const getExerciseToWorkoutPlan = async (workoutPlanId) => {
    const token = await AsyncStorage.getItem("token");

    return authApi(token).get(endpoints.workoutplanDetail(workoutPlanId));
};

export const postExerciseToWorkoutPlan = async (workoutPlanId, data) => {
    const token = await AsyncStorage.getItem("token");

    return authApi(token).post(endpoints.workoutplanDetail(workoutPlanId), data,{
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );
};