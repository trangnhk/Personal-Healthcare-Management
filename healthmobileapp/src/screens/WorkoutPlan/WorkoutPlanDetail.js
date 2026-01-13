import { useNavigation, useRoute } from "@react-navigation/native";
import { useContext, useEffect, useState } from "react";
import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { MyUserContext } from "../../utils/contexts";
import { getExerciseToWorkoutPlan } from "../../services/workout.services";
import MyStyles from "../../styles/MyStyles";
import { Card, List } from "react-native-paper";
import MaterialIcons from "@react-native-vector-icons/material-icons";

const WorkoutPlanDetail = () => {
    const route = useRoute();
    const workoutPlanId = route.params?.workoutPlanId;
    const workoutPlanTitle = route.params?.workoutPlanTitle;
    const [workoutplan, setWorkoutplan] = useState(null);
    const [loading, setLoading] = useState(false);
    const [user, dispatch] = useContext(MyUserContext);
    const nav = useNavigation();
    
    console.log("WORKOUT PLAN ID: ", workoutPlanId);

    const loadWorkoutplan = async () => {
        try{
            if (loading) return;
            setLoading(true);
            let res = await getExerciseToWorkoutPlan(workoutPlanId);


            setWorkoutplan(res.data.results);
            console.log(res.data.results);
        }
        catch(err){
            console.log(err);
        }
        finally{
            setLoading(false);
        }
    };

    useEffect(() => {
        if (workoutPlanId)
            loadWorkoutplan();
    }, [workoutPlanId]);

    return (
        <ScrollView style={MyStyles.container}>
            {loading && <ActivityIndicator size="large" style={{margin: 20}}/>}

            {workoutplan && (
                <Card style={{width: "100%", marginBottom: 40}}>
                    <Card.Content style={MyStyles.padding}>
                        <Text style={MyStyles.title}>Kế hoạch tập luyện: {workoutPlanTitle}</Text>
                        {workoutplan && workoutplan.map((item) => (
                        <List.Accordion
                            key={item.id}
                            title={item.exercise?.name} titleStyle={[MyStyles.text, {color: '#188d66ff', fontWeight: 'bold'}]}
                            left={() => { if(item.exercise.image)
                                            return <Image source={{uri: item.exercise.image}} style={[MyStyles.image, {width: 50, height: 50}]}/>;    
                                        return <MaterialIcons name="fitness-center" size={40} color="#16b494ff"/>;
                                    }}
                        >
                            <List.Item
                                title={`Thời gian: ${item.duration} phút`}
                            />
                            <List.Item
                                title={`Số hiệp: ${item.sets}`}
                            />
                            <List.Item
                                title={`Số lần: ${item.reps}`}
                            />
                            <List.Item
                                title={`Thời gian nghỉ: ${item.rest_seconds} giây`}
                            />
                        </List.Accordion>
                    ))}

                    <TouchableOpacity style={[MyStyles.button]} onPress={() => nav.navigate("AddExerciseToWorkoutPlan", {workoutPlanId: workoutPlanId, workoutplanTitle: workoutPlanTitle})}>
                        <Text style={MyStyles.textButton}>Thêm Bài tập</Text>
                    </TouchableOpacity>

                    </Card.Content>

                </Card>
            )}

        </ScrollView>
    );
};

export default WorkoutPlanDetail;