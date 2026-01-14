import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { Alert, TouchableOpacity, View } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { Button, Checkbox, HelperText, Text, TextInput } from "react-native-paper";
import { registerUser } from "../../services/auth.services";
import MyStyles from "../../styles/MyStyles";
import { Image } from "react-native";

const RegisterTab = () => {
    const info = [
        {
            label: "Tên đăng nhập",
            field: "username",
            icon: "account"
        },
        {
            label: "Email",
            field: "email",
            icon: "email"
        },
        {
            label: "Mật khẩu",
            field: "password",
            icon: "eye",
            secureTextEntry: true
        },
        {
            label: "Xác nhận mật khẩu",
            field: "confirm",
            icon: "eye",
            secureTextEntry: true
        }
    ];

    const [user, setUser] = useState({
        username: "",
        email: "",
        password: "",
        confirm: "",
        role: "client",
        avatar: null
    });
    
    const [errMsg, setErrMsg] = useState();
    const [loading, setLoading] = useState(false);
    const nav = useNavigation();

    const validate = () => {
        if (!user.username || !user.email) {
            setErrMsg("Vui lòng nhập đầy đủ username và email!");
            return false;
        }

        if (!user.password || !user.confirm) {
            setErrMsg("Vui lòng nhập đầy đủ mật khẩu!");
            return false;
        }

        if (user.password !== user.confirm) {
            setErrMsg("Mật khẩu KHÔNG khớp!");
            return false;
        }

        return true;
    };


    const register = async () => {
        if (!validate()) return;

        try {
            setLoading(true);

            const form = new FormData();
            form.append("username", user.username);
            form.append("email", user.email);
            form.append("password", user.password);
            form.append("role", user.role); 

            if (user.avatar) {
                form.append("avatar", {
                    uri: user.avatar.uri,
                    name: "avatar.jpg",
                    type: "image/jpeg",
                });
            }

            const res = await registerUser(form);

            if (res.status === 201) {
                Alert.alert("Thành công", "Đăng ký thành công!");
                nav.navigate("LoginTab");
            }
        } catch (err) {
            console.error(err.response?.data);
            setErrMsg("Đăng ký thất bại. Vui lòng thử lại!");
        } finally {
            setLoading(false);
        }
    };

    const picker = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== "granted") {
            Alert.alert("Permission denied!");
            return;
        }

        const res = await ImagePicker.launchImageLibraryAsync();

        if (!res.canceled) {
            setUser({ ...user, avatar: res.assets[0] });
        }
    };

    return (
        <View style={[MyStyles.container, MyStyles.padding]}>
            <Text style={MyStyles.title}>ĐĂNG KÝ TÀI KHOẢN</Text>

            <HelperText type="error" visible={!!errMsg}>
                {errMsg}
            </HelperText>
            
            {info.map(i => (
                <TextInput
                    key={i.field}
                    label={i.label}
                    value={user[i.field]}
                    secureTextEntry={i.secureTextEntry}
                    right={<TextInput.Icon icon={i.icon} />}
                    style={{ marginBottom: 10 }}
                    onChangeText={t => setUser({ ...user, [i.field]: t })}
                />
            ))}

            <Text style={{ marginTop: 10, marginBottom: 5, fontWeight: "bold" }}>
                Vai trò
            </Text>

            <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Checkbox
                    status={user.role === "client" ? "checked" : "unchecked"}
                    onPress={() => setUser({ ...user, role: "client" })}
                />
                <Text>Client</Text>

                <Checkbox
                    status={user.role === "expert" ? "checked" : "unchecked"}
                    onPress={() => setUser({ ...user, role: "expert" })}
                />
                <Text>Expert</Text>
            </View>

            <TouchableOpacity
                onPress={picker}
                style={{ marginVertical: 15 }}
            >
                <Text>Chọn ảnh đại diện</Text>
            </TouchableOpacity>

            {user.avatar && (
                <Image
                    source={{ uri: user.avatar.uri }}
                    style={[MyStyles.avatar, { alignSelf: "center" }]}
                />
            )}

            <Button
                mode="contained"
                loading={loading}
                disabled={loading}
                onPress={register}
                style={{ marginTop: 15 }}
            >
                Đăng ký
            </Button>
        </View>
    );



};
export default RegisterTab;