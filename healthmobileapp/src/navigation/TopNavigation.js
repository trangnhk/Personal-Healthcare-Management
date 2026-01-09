import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Home from '../screens/Home/Home';
import LoginTab from '../screens/User/Login';
import { Icon } from 'react-native-paper';
import { useContext } from 'react';
import { MyUserContext } from '../utils/contexts';
import RegisterTab from '../screens/User/Register';
import AccountTab from '../screens/User/Account';

const Tab = createMaterialTopTabNavigator();

const MainTopTabNavigator = () => {
    const [user, ] = useContext(MyUserContext);
    return (
        <Tab.Navigator style={{ marginTop: 30 }}>
        <Tab.Screen
            name="HomeTab"
            component={Home}
            options={{ title: "Trang chủ" , tabBarIcon: () => <Icon source="home" size={35} color="#13785aff"/>}}
        />
        {user === null?<>
            <Tab.Screen
                name="RegisterTab"
                component={RegisterTab}
                options={{ title: "Đăng ký" , tabBarIcon: () => <Icon source="account" size={35} color="#13785aff"/>}}
            />
            <Tab.Screen
                name="LoginTab"
                component={LoginTab}
                options={{ title: "Đăng nhập" , tabBarIcon: () => <Icon source="account" size={35} color="#13785aff"/>}}
            />
        </> : 
        <>
            <Tab.Screen
                name="AccountTab"
                component={AccountTab}
                options={{ title: "Tài khoản" , tabBarIcon: () => <Icon source="account" size={35} color="#13785aff"/>}}
            />
        </>}
        
        </Tab.Navigator>
    );
};

export default MainTopTabNavigator;
