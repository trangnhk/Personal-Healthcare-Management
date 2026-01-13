import { useNavigation, useRoute } from "@react-navigation/native";
import { useContext, useEffect, useState } from "react";
import { getExerciseDetail } from "../../services/home.services";
import { ScrollView, View, Text, TouchableOpacity } from "react-native";
import MyStyles from "../../styles/MyStyles";
import { ActivityIndicator, Card } from "react-native-paper";
import { MyUserContext } from "../../utils/contexts";

const ExerciseDetail = () => {
    const route = useRoute();
    const exerciseId = route.params?.exerciseId;
    const [exercise, setExercise] = useState(null);
    const [loading, setLoading] = useState(false);
    const [user, dispatch] = useContext(MyUserContext);
    const nav = useNavigation();

    const loadExercise = async () => {
        try {
            setLoading(true);
            let res = await getExerciseDetail(exerciseId);

            setExercise(res.data);
            console.log(exercise);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (exerciseId) {
            loadExercise();
        }
    }, [exerciseId]);

    return (
        <ScrollView style={MyStyles.container}>
    {loading && <ActivityIndicator size="large" style={{ margin: 20 }} />}

    {exercise && (
        <Card style={{width: '100%', marginBottom: 40 }}>
            <Card.Content style={MyStyles.padding}>
                <Text style={MyStyles.title}>{exercise.name}</Text>
                <Text style={MyStyles.word} alignSelf="center">{exercise.description}</Text>
                <Text style={{fontSize: 17, padding: 5}}>Lượng calories tiêu thụ/phút: {exercise.calories_per_minute}</Text>
                {exercise.created_by && (
                    <Text style={MyStyles.note} alignSelf="center">
                        Tạo bởi: {exercise.created_by.username}
                    </Text>
                )}
            </Card.Content>
            {exercise.image && (
                <Card.Cover
                    source={{ uri: exercise.image }}
                    style={{ width: '100%', height: 400 }}
                    resizeMode="cover"
                />
            )}
            <Card.Content>
                {!user && (
                    <TouchableOpacity>
                        <Text style={MyStyles.annoucement} fontWeight="bold">Đăng nhập để kết nối với chuyên gia (Click tại đây)</Text>
                    </TouchableOpacity>
                )}
                <View style={MyStyles.row} justifyContent="center" alignItems="center">
                    <TouchableOpacity style={MyStyles.button} onPress={() => {nav.navigate("NewWorkoutPlan")}}>
                        <Text style={MyStyles.textButton}>Thêm vào kế hoạch</Text>
                    </TouchableOpacity>
                </View>
                

            </Card.Content>
        </Card>
    )}
</ScrollView>


    )


}
export default ExerciseDetail;