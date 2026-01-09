import { useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { getExerciseDetail } from "../../services/home.services";
import { ScrollView, View, Text, TouchableOpacity } from "react-native";
import MyStyles from "../../styles/MyStyles";
import { ActivityIndicator, Card } from "react-native-paper";

const ExerciseDetail = () => {
    const route = useRoute();

    const exerciseId = route.params?.exerciseId;
    const [exercise, setExercise] = useState(null);
    const [loading, setLoading] = useState(false);

    const loadExercise = async () => {
        try {
            setLoading(true);
            let res = await getExerciseDetail(exerciseId);

            setExercise(res.data);
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
        <Card style={{ margin: 20, width: '100%', marginBottom: 40 }}>
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
                <TouchableOpacity>
                    <Text style={MyStyles.annoucement} fontWeight="bold">Đăng nhập để tạo kế hoạch tập luyện (Click tại đây)</Text>
                </TouchableOpacity>
            </Card.Content>
        </Card>
    )}
</ScrollView>


    )


}
export default ExerciseDetail;