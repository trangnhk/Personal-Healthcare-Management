import { useContext, useEffect, useState } from "react";
import { MyUserContext } from "../../utils/contexts";
import { Alert, Image, ScrollView, Text, TouchableOpacity, ViewBase } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View } from "react-native";
import MyStyles from "../../styles/MyStyles";
import { getCurrentUser } from "../../services/account.services";
import { useNavigation } from "@react-navigation/native";
import { Button, Card, Icon, Modal, PaperProvider, Portal } from "react-native-paper";

const AccountTab = () => {
    const [user, dispatch] = useContext(MyUserContext);
    const nav = useNavigation();
    const [showExpertModal, setShowExpertModal] = useState(false);
    

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

    console.log(user);

    return (
        <PaperProvider>

        <Portal>
                <Modal
                    visible={showExpertModal}
                    onDismiss={() => setShowExpertModal(false)}
                    contentContainerStyle={{
                        backgroundColor: "white",
                        padding: 20,
                        borderRadius: 10,
                        margin: 20
                    }}
                >
                    {user.experts ? (
                        <View style={{ alignItems: "center" }}>
                            {user.experts.avatar && (
                                <Image
                                    source={{ uri: user.experts.avatar }}
                                    style={{ width: 80, height: 80, borderRadius: 40, marginBottom: 10 }}
                                />
                                )}
                                {user.experts?.length ? (
                                    user.experts.map(expert => (
                                        <View key={expert.id} style={{ alignItems: "center", marginBottom: 10 }}>
                                            <Image source={{ uri: `https://rinne308205.pythonanywhere.com${expert.avatar}` }} style={MyStyles.image}/>
                                            <Text style={MyStyles.text}>{expert.username}</Text>
                                        </View>
                                    ))

                                ) : (
                                    <Text>Chưa có chuyên gia</Text>
                                )}

                            <Button
                                mode="contained"
                                style={{ marginTop: 15 }}
                                onPress={() => setShowExpertModal(false)}
                            >
                                Đóng
                            </Button>
                        </View>
                    ) : (
                        <Text>Bạn chưa có chuyên gia</Text>
                    )}
                </Modal>
            </Portal>

        <ScrollView style={[MyStyles.padding, MyStyles.container]}>
            <Card style={{marginBlockEnd: 20}}>
                <Card.Content>
                    <TouchableOpacity activeOpacity={0.7} onPress={() =>{
                                                            nav.navigate("Reminders")
                                                        }}>
                    <Icon source={"alarm"} size={30} />
                    </TouchableOpacity>
                </Card.Content>
                <Card.Content>
                    <Button icon="account-edit" style={{marginStart: 600}} onPress={() => {nav.navigate("AccountEdit")}}>Chỉnh sửa</Button>
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
                        <Text style={MyStyles.text}>Ngày sinh: {user.dob}</Text>
                        <Text style={MyStyles.text}>Email: {user.email}</Text>
                        <Text style={[MyStyles.text, {color: "red"}]}>Vai trò: {user.role}</Text>
                        </View>
                        {user.client_profile && (
                            <View style={MyStyles.padding}>
                                <Text style={MyStyles.text}>Chiều cao: {user.client_profile.height} cm</Text>
                                <Text style={MyStyles.text}>Cân nặng: {user.client_profile.weight} kg</Text>
                                <Text style={MyStyles.text}>BMI: {user.client_profile.bmi}</Text>
                                
                            </View>
                        )}
                    </View>
                    {user.client_profile && (
                        <Text style={[MyStyles.annoucement, {fontWeight: "bold", fontSize: 25}]}>Mục tiêu: {user.client_profile.health_goal}</Text>
                    )}

                </Card.Content>

                <Card.Content>
                    <View style={MyStyles.row} justifyContent="center" alignItems="center">
                        <TouchableOpacity style={MyStyles.button} onPress={() =>{ nav.navigate("WorkoutPlans")}}>
                            <Text style={MyStyles.textButton}>Kế hoạch luyện tập</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={MyStyles.button} onPress={() =>{ nav.navigate("HealthDiaries")}}>
                            <Text style={MyStyles.textButton}>Nhật ký</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={MyStyles.button} onPress={() => setShowExpertModal(true)}>
                            <Text style={MyStyles.textButton}>Chuyên gia của tôi</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={MyStyles.button} onPress={() => { nav.navigate("Reminders")}}>
                            <Text style={MyStyles.textButton}>Báo thức của tôi</Text>
                        </TouchableOpacity>
                    </View>
                    
                </Card.Content>
            </Card>
            <TouchableOpacity style={[MyStyles.button]} onPress={logout}>
                <Text style={MyStyles.textButton}>Đăng xuất</Text>
            </TouchableOpacity>
        </ScrollView>
        </PaperProvider>
    );

};
export default AccountTab;