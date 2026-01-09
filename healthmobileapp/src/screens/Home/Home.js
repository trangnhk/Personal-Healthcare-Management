import { useState } from "react";
import Exercises from "../../components/Exercises";
import { List } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { View } from "react-native";
import MyStyles from "../../styles/MyStyles";

const Home = () => {
    const nav = useNavigation();

    return (
        
        <View>
            // Exercises
            <List.Section>
                <List.Subheader style={MyStyles.word}>Bài tập công khai</List.Subheader>
                <List.Item style={MyStyles.padding} 
                    title="Xem danh sách bài tập" titleStyle={{fontSize: 20, fontWeight: 'bold'}}
                    description="Nhấn vào đây để xem danh sách các bài tập công khai"
                    left={() => <List.Icon icon="dumbbell" />}
                    onPress={() => nav.navigate("Exercises")}
                />
            </List.Section>
            // Experts
            <List.Section>
                <List.Subheader style={MyStyles.word}>Chuyên gia</List.Subheader>
                <List.Item style={MyStyles.padding}
                    title="Xem danh sách chuyên gia" titleStyle={{fontSize: 20, fontWeight: 'bold'}}
                    description="Nhấn vào đây để xem danh sách các chuyên gia"
                    left={() => <List.Icon icon="account-group" />}
                    onPress={() => nav.navigate("Experts")}
                />
            </List.Section>
        </View>

    );
};

export default Home;

