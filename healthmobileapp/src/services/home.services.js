import axios from "axios";
import { publicApi } from "./Apis";
import { endpoints } from "./Endpoints";
import { BASE_URL } from "../config/env";

export const getPublicExercises = (search = "", cursor = null) => {
    let url = "/exercises/";

    if (cursor) {
        url = cursor.replace(BASE_URL, "");
    } else if (search) {
        url += `?search=${search}`;
    }

    return publicApi.get(url);
};

export const getExperts = () => {
    return publicApi.get(endpoints.experts);
}
    
export const getExpertDetail = (expertId) => {
    return publicApi.get(endpoints.expertDetail(expertId));
}

export const getExerciseDetail = (exerciseId) =>{
    return publicApi.get(`/exercises/${exerciseId}/`);
}