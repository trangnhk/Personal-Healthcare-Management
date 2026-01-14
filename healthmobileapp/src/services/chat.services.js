import { endpoints } from "./Endpoints";

export const getChats = async (data) => {
    const token = await AsyncStorage.getItem("token");

    
    return authApi(token).get(endpoints.chats);
};

