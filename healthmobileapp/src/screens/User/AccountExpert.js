import { useContext, useEffect, useState } from "react";
import { MyUserContext } from "../../utils/contexts";
import { Alert, Image, ScrollView, Text, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View } from "react-native";
import MyStyles from "../../styles/MyStyles";
import { getCurrentUser } from "../../services/account.services";
import { useNavigation } from "@react-navigation/native";
import { Button, Card, Icon } from "react-native-paper";

const AccountExpertTab = () => {
    const [user, dispatch] = useContext(MyUserContext);
    // const [loading, setLoading] = useState(false);
    const nav = useNavigation();

    console.info("USER: ",user);
    console.info("DISPATCH: ", dispatch);

    

    const logout = () => {
        Alert.alert(
            "Đăng xuất",
            "Bạn có chắc chắn muốn đăng xuất?",
            [
                { text: "Hủy", style: "cancel" },
                {
                    text: "Đăng xuất", style: "destructive", onPress: async () => {
                        await AsyncStorage.removeItem("token");
                        dispatch({ type: "logout" });
                        nav.navigate("MainTabs");
                    }
                }
            ]
        )
    }

    const normalizeAvatar = (avatar) => {
        if (!avatar) return null;

        if (avatar.startsWith("http")) return avatar;

        const index = avatar.indexOf("https://");
        if (index !== -1) {
            return avatar.slice(index);
        }

        return null;
    };

    

    if (!user)
        return null;


    return (
        <ScrollView style={[MyStyles.padding, MyStyles.container]}>
            <Card style={{marginBlockEnd: 20}}>
                <Card.Content>
                    <Button icon="account-edit" style={{marginStart: 600}} onPress={() => {}}>Chỉnh sửa</Button>
                </Card.Content>

                <Card.Content style={MyStyles.padding}>
                    <View style={MyStyles.row} justifyContent="center" alignItems="center" >
                    {user.avatar && (
                        <Image
                            source={{ uri: normalizeAvatar(user.avatar) }}
                            style={MyStyles.avatar}
                        />
                    )}
                    
                    </View>
                    <Text style={MyStyles.title}>XIN CHÀO {user.username}</Text>
                    <View style={MyStyles.row} justifyContent="center" alignItems="center">
                        <View style={MyStyles.padding}>
                        
                        <Text style={MyStyles.text}>Họ: {user.last_name}</Text>
                        <Text style={MyStyles.text}>Tên: {user.first_name}</Text>
                        <Text style={MyStyles.text}>Ngày sinh: {user.dob} cm</Text>
                        <Text style={MyStyles.text}>Email: {user.email}</Text>
                        <Text style={[MyStyles.text, {color: "red"}]}>Vai trò: {user.role}</Text>
                        </View>
                        {user.expert_profile && (
                            <View style={MyStyles.padding}>
                                <Text style={MyStyles.text}>Kinh nghiệm: {user.expert_profile.experience} năm</Text>
                                <Text style={MyStyles.text}>Tỉ lệ đánh giá: {user.expert_profile.rating} / 5</Text>
                                
                            </View>
                        )}
                    </View>
                    {user.expert_profile && (
                        <Text style={[MyStyles.annoucement, {fontWeight: "bold", fontSize: 25}]}>Giới thiệu: {user.expert_profile.bio}</Text>
                    )}

                </Card.Content>

                <Card.Content>
                    <View style={MyStyles.row} justifyContent="center" alignItems="center">
                        <TouchableOpacity style={MyStyles.button} onPress={() =>{ nav.navigate("WorkoutPlans")}}>
                            <Text style={MyStyles.textButton}>Kế hoạch luyện tập</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity style={MyStyles.button} onPress={() =>{}}>
                            <Text style={MyStyles.textButton}>Khách hàng của tôi</Text>
                        </TouchableOpacity>
                    </View>
                    
                </Card.Content>
            </Card>
            <TouchableOpacity style={[MyStyles.button]} onPress={logout}>
                <Text style={MyStyles.textButton}>Đăng xuất</Text>
            </TouchableOpacity>
        </ScrollView>
    );

};
export default AccountExpertTab;