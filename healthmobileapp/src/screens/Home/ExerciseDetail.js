import { useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { getExerciseDetail } from "../../services/home.services";
import { ScrollView, View, Text } from "react-native";
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
            {loading ? <ActivityIndicator /> : null}

            {exercise ? (
                <Card>
                    <Card.Content style={{alignSelf: "center"}}>
                        <Text style={MyStyles.title}>{exercise.name}</Text>
                        <Text style={MyStyles.word}>{exercise.description}</Text>
                        <Text>Lượng calories tiêu thụ/phút: {exercise.calories_per_minute}</Text>
                        

                        {exercise.created_by ? (
                            <Text>
                                Tạo bởi: {exercise.created_by.username}
                            </Text>
                        ) : null}
                    </Card.Content>
                </Card>
            ) : null}
        </ScrollView>

    )


}
export default ExerciseDetail;