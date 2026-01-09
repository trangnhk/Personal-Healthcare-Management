import { Button, Label } from "@react-navigation/elements";
import React, { useContext, useState } from "react";
import { View, Text, Image } from "react-native";
import { MyUserContext } from "../../utils/contexts";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApi } from "../../services/Apis";
import { endpoints } from "../../services/Endpoints";
import { HelperText, TextInput } from "react-native-paper";
import MyStyles from "../../styles/MyStyles";
import { login } from "../../services/Auth.Services";

const LoginTab = ({route}) => {
  const info = [{
    "label": "Tên đăng nhập",
    "field": "username",
    "icon": "account-circle-outline"
  }, {
    "label": "Mật khẩu",
    "field": "password",
    "icon": "lock-outline",
    "secureTextEntry": true
  }];

  const [user, setUser] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [,dispatch] = useContext(MyUserContext);

  const validate = () => {
    if (!user.username || !user.password) {
      setError("Vui lòng điền đầy đủ thông tin");
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    try{
      setLoading(true);

      let res = await login({
        username: user.username,
        password: user.password,
        'client_id': '2DQGxmgSs5UdMJ796tIZbTOq4aFLrWuED0v7vpTc',
        'client_secret': '3FqViE6Hh0qICpiECsZMDN3VOYLVZKIr5RA8ucSs4YVPbANn2X0b6GHbragkt6YqtAT6toDRrQhEH6HB258VvGhq2NCS5byzd7noQD2eQpJK1qKMMDljanFefBpsEyH8',
      });
      console.info(res.data);

      await AsyncStorage.setItem('token', res.data.access_token);

      setTimeout(async () => {
        let userRes = await authApi(res.data.access_token).get(endpoints.currentUser);
        console.info(userRes.data);

        dispatch({
          'type': 'login',
          'payload': userRes.data
        });

        const next = route.params?.next;
        if (next) {
          next();
        }
      }, 500);
    }
    catch(err){
      console.error(err);
      console.log("OAuth error:", err.response?.data);
      setError("Đăng nhập không thành công");
    }finally{
      setLoading(false);
    }
    
  };



  return (
    <View style={MyStyles.padding}>
      <Text style={MyStyles.title}>ĐĂNG NHẬP NGƯỜI DÙNG</Text>

      <HelperText type="error" visible={error}>
          {error}
      </HelperText>

      {info.map(i => <TextInput key={i.field} style={MyStyles.margin}
                            label={i.label}
                            secureTextEntry={i.secureTextEntry}
                            right={<TextInput.Icon icon={i.icon} />}
                            value={user[i.field]}
                            onChangeText={t => setUser({...user, [i.field]: t})} />)}

          
            {user.avatar && <Image  source={{uri: user.avatar.uri}} width={250} style={[MyStyles.avatar, MyStyles.margin]} />}

            <Button loading={loading} disabled={loading} mode="contained" icon="account" onPress={handleLogin}>Đăng nhập</Button>
    </View>
  );
};

export default LoginTab;