import { useNavigation } from "@react-navigation/native";
import { useContext, useState } from "react";
import { Alert, Image, TouchableOpacity, View } from "react-native"
import { Button, Modal, PaperProvider, Portal, Text, TextInput } from "react-native-paper";
import { MyUserContext } from "../../utils/contexts";
import * as ImagePicker from "expo-image-picker";
import { getCurrentUser, patchProfile } from "../../services/account.services";
import MyStyles from "../../styles/MyStyles";

const AccountEdit = () => {
    const nav = useNavigation();
    const [user, dispatch] = useContext(MyUserContext);

    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        avatar: null,
    });

    const [showPasswordModal, setShowPasswordModal] = useState(false);

    const [passwordForm, setPasswordForm] = useState({
        old_password: "",
        password: "",
        confirm_password: "",
    });

    const [passwordLoading, setPasswordLoading] = useState(false);

    const submitChangePassword = async () => {
        if (!passwordForm.old_password) {
            Alert.alert("Lỗi", "Vui lòng nhập mật khẩu cũ");
            return;
        }

        if (passwordForm.password !== passwordForm.confirm_password) {
            Alert.alert("Lỗi", "Mật khẩu xác nhận không khớp");
            return;
        }

        try {
            setPasswordLoading(true);

            const formData = new FormData();
            formData.append("old_password", passwordForm.old_password);
            formData.append("password", passwordForm.password);

            await patchProfile(user.id, formData);

            Alert.alert("Thành công", "Đổi mật khẩu thành công");

            setPasswordForm({
                old_password: "",
                password: "",
                confirm_password: "",
            });

            setShowPasswordModal(false);
        } catch (err) {
            console.error(err.response?.data);

            Alert.alert(
                "Lỗi",
                err.response?.data?.old_password?.[0] ||
                "Không thể đổi mật khẩu"
            );
        } finally {
            setPasswordLoading(false);
        }
    };

    const changeValue = (field, value) => {
        setForm(current => ({ ...current, [field]: value }));
    };

    const pickAvatar = async () => {
        const result = await ImagePicker.launchImageLibraryAsync();

        if (!result.canceled) {
            setForm(current => ({
                ...current,
                avatar: result.assets[0],
            }));
        }
    };

    const submit = async () => {
        try {
            setLoading(true);

            const formData = new FormData();
            formData.append("first_name", form.first_name);
            formData.append("last_name", form.last_name);
            formData.append("email", form.email);

            if (form.avatar) {
                formData.append("avatar", {
                    uri: form.avatar.uri,
                    name: "avatar.jpg",
                    type: "image/jpeg",
                });
            }

            const res = await patchProfile(user.id, formData);

            const me = await getCurrentUser();

            dispatch({
                type: "login",
                payload: me.data,
            });

            Alert.alert("Thành công", "Cập nhật thông tin thành công");
            nav.goBack();
        } catch (err) {
            console.error(err.response?.data);
            Alert.alert("Lỗi", "Không thể cập nhật thông tin");
        } finally {
            setLoading(false);
        }
    };

    

    return (
        <PaperProvider>
        <View style={[MyStyles.container, MyStyles.padding]}>
            <View>
                <Text style={MyStyles.title}>CHỈNH SỬA TÀI KHOẢN</Text>
                <Button mode="contained-tonal" onPress={() => setShowPasswordModal(true)}>Thay đổi mật khẩu</Button>

                <Portal>
                    <Modal
                        visible={showPasswordModal}
                        onDismiss={() => setShowPasswordModal(false)}
                        contentContainerStyle={{
                            backgroundColor: "white",
                            padding: 20,
                            margin: 20,
                            borderRadius: 10,
                        }}
                    >
                        <Text style={[MyStyles.title, { marginBottom: 15 }]}>
                            ĐỔI MẬT KHẨU
                        </Text>

                        <TextInput
                            label="Mật khẩu cũ"
                            secureTextEntry
                            value={passwordForm.old_password}
                            onChangeText={text =>
                                setPasswordForm(p => ({ ...p, old_password: text }))
                            }
                            style={{ marginBottom: 10 }}
                        />

                        <TextInput
                            label="Mật khẩu mới"
                            secureTextEntry
                            value={passwordForm.password}
                            onChangeText={text =>
                                setPasswordForm(p => ({ ...p, password: text }))
                            }
                            style={{ marginBottom: 10 }}
                        />

                        <TextInput
                            label="Xác nhận mật khẩu"
                            secureTextEntry
                            value={passwordForm.confirm_password}
                            onChangeText={text =>
                                setPasswordForm(p => ({ ...p, confirm_password: text }))
                            }
                            style={{ marginBottom: 15 }}
                        />

                        <Button
                            mode="contained"
                            loading={passwordLoading}
                            onPress={submitChangePassword}
                        >
                            Lưu mật khẩu
                        </Button>

                        <Button
                            onPress={() => setShowPasswordModal(false)}
                            style={{ marginTop: 10 }}
                        >
                            Hủy
                        </Button>
                    </Modal>
                </Portal>

            
            </View>



            <TouchableOpacity onPress={pickAvatar} style={[MyStyles.padding, { alignItems: "center" }]}>
                <Image source={{ uri: form.avatar?.uri || user.avatar }}  style={MyStyles.avatar} />
                <Text style={MyStyles.padding}>Chọn ảnh đại diện</Text>
            </TouchableOpacity>

            <TextInput
                label="Họ"
                value={form.last_name}
                onChangeText={text => changeValue("last_name", text)}
                style={{ marginBottom: 10 }}
            />

            <TextInput
                label="Tên"
                value={form.first_name}
                onChangeText={text => changeValue("first_name", text)}
                style={{ marginBottom: 10 }}
            />

            <TextInput
                label="Email"
                value={form.email}
                onChangeText={text => changeValue("email", text)}
                keyboardType="email-address"
                style={{ marginBottom: 15 }}
            />

            <Button mode="contained" onPress={submit} loading={loading} disabled={loading} >
                Lưu thay đổi
            </Button>
        
        </View>
        </PaperProvider>
    );
};


export default AccountEdit;