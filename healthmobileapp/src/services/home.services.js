import axios from "axios";
import { authApi, publicApi } from "./Apis";
import { endpoints } from "./Endpoints";
import { BASE_URL } from "../config/env";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const getPublicExercises = async (search = "", cursor = null) => {
    let url = "/exercises/";

    if (cursor) {
        url = cursor.replace(BASE_URL, "");
    } else if (search) {
        url += `?search=${search}`;
    }

    const token = await AsyncStorage.getItem("token");

    if (token){
        return authApi(token).get(url);
    }

    return publicApi.get(url);
};

export const getExperts = () => {
    return publicApi.get(endpoints.experts);
}
    
export const getExpertDetail = async (expertId) => {

    return publicApi.get(endpoints.expertDetail(expertId));
}

export const getExerciseDetail = async(exerciseId) =>{
    const token = await AsyncStorage.getItem("token");

    if (token){
        return authApi(token).get(`/exercises/${exerciseId}/`);
    }
    return publicApi.get(`/exercises/${exerciseId}/`);
}

export const createExercise = async (data) => {
    const token = await AsyncStorage.getItem("token");
    return authApi(token).post(endpoints.publicExercises, data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

export const getHealthDiaries = async (cursor = null) => {
    let url = '/healthdiaries/';
    if (cursor)
        url = cursor.replace(BASE_URL, "");

    const token = await AsyncStorage.getItem("token");

    
    return authApi(token).get(url);
};
