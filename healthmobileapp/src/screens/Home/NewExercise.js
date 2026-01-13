import { useState } from "react";
import { Alert, Button, View, Image, Switch, Text, TouchableOpacity } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from "@react-navigation/native";
import { createExercise } from "../../services/home.services";
import { TextInput } from "react-native-paper";
import MyStyles from "../../styles/MyStyles";


const NewExercise = () => {
    const [name, setName] = useState("");
    const [muscleGroup, setMuscleGroup] = useState("");
    const [description, setDescription] = useState("");
    const [calories, setCalories] = useState("");
    const [isPublic, setIsPublic] = useState(true);
    const [image, setImage] = useState(null);
    const nav = useNavigation();

    const picker = async () => {
        const {granted} = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (granted) {
            const res = await ImagePicker.launchImageLibraryAsync();
            if (!res.canceled)
                setImage(res.assets[0]);

        } else
            Alert.alert("Permission denied!");
    }

    const submit = async () => {
        if (!name) {
            Alert.alert("Lỗi", "Tên bài tập là bắt buộc");
            return;
        }

        const form = new FormData();
        form.append("name", name);
        form.append("muscle_group", muscleGroup);
        form.append("description", description);
        form.append("calories_per_minute",calories ? Number(calories) : 0);
        form.append("is_public", isPublic ? 1 : 0);



        if (image) {
            form.append("image", {
                uri: image.uri,
                name: "exercise.jpg",
                type: "image/jpeg",
            });
        }

        try {
            await createExercise(form);
            Alert.alert("Thành công", "Đã tạo bài tập");
            nav.goBack();
        } catch (err) {
            console.error(err.response?.data);
            Alert.alert("Lỗi", "Không thể tạo bài tập");
        }
    };

    return (
        <View style={[MyStyles.container]}>
            <Text style={[MyStyles.text, {color: "#034b25", fontWeight: "bold", margin: 10}]}>Tên bài tập</Text>
            <TextInput placeholder="Tên bài tập" value={name} onChangeText={setName} />
            <Text style={[MyStyles.text, {color: "#034b25", fontWeight: "bold", margin: 10}]}>Nhóm cơ</Text>
            <TextInput placeholder="Nhóm cơ" value={muscleGroup} onChangeText={setMuscleGroup} />
            <Text style={[MyStyles.text, {color: "#034b25", fontWeight: "bold", margin: 10}]}>Mô tả</Text>
            <TextInput placeholder="Mô tả" value={description} onChangeText={setDescription} />
            <Text style={[MyStyles.text, {color: "#034b25", fontWeight: "bold", margin: 10}]}>Calories/phút</Text>
            <TextInput placeholder="Calories/phút" keyboardType="numeric" value={calories} onChangeText={setCalories}/>
            
            <View style={MyStyles.row} justifyContent="center" alignItems="center">
                <Text style={MyStyles.annoucement}>Công khai cho tất cả mọi người</Text>
                <Switch style={MyStyles.padding} value={isPublic} onValueChange={setIsPublic} />
            </View>

            {image && (
                <Image source={{ uri: image.uri }} style={[MyStyles.avatar, {alignSelf: "center"}]} />
            )}

            <Button title="Chọn ảnh" onPress={picker} />
            <TouchableOpacity style={MyStyles.button} onPress={submit}>
                <Text style={MyStyles.textButton}>Tạo bài tập</Text>
            </TouchableOpacity>
        </View>
    );
};

export default NewExercise;