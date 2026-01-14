import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../config/env";
import { authApi } from "./Apis";
import { endpoints } from "./Endpoints";

export const getReminders = async (cursor = null) => {
    let url = '/reminders/';

    if (cursor)
        url = cursor.replace(BASE_URL, "");

    const token = await AsyncStorage.getItem("token");

    
    return authApi(token).get(url);
}

export const postSetDoneReminders = async (reminderId) => {
    const token = await AsyncStorage.getItem("token");

    return authApi(token).post(endpoints.remindersDone(reminderId));
}

export const patchReminders = async (reminderId) => {
    const token = await AsyncStorage.getItem("token");

    return authApi(token).patch(endpoints.remindersEdit(reminderId));
}
