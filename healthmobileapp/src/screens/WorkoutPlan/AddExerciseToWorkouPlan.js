import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Alert, FlatList, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { postExerciseToWorkoutPlan } from "../../services/workout.services";
import { ActivityIndicator, TextInput } from "react-native-paper";
import MyStyles from "../../styles/MyStyles";
import { getPublicExercises } from "../../services/home.services";
import { endpoints } from "../../services/Endpoints";

const ExerciseToWorkoutPlan = () => {
    const nav = useNavigation();
    const route = useRoute();
    const workoutPlanId = route.params?.workoutPlanId;
    const workoutplanTitle = route.params?.workoutplanTitle;
    console.log("ROUTE PARAMS:", route.params);

    const info = [{
        "label": "Thời gian (phút)",
        "field": "duration",
        "keyboardType": "numeric"
    },
    {
        "label": "Số hiệp",
        "field": "sets",
        "keyboardType": "numeric"
    },
    {
        "label": "Số lần",
        "field": "reps",
        "keyboardType": "numeric"
    },
    {
        "label": "Thời gian nghỉ (giây)",
        "field": "rest_seconds",
        "keyboardType": "numeric"
    }
    ];

    const [exercises, setExercises] = useState([]);
    const [selectedExercise, setSelectedExercise] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isEndReached, setIsEndReached] = useState(false);
    const [next, setNext] = useState(null);

    const [data, setData] = useState({
        "duration": "20",
        "sets": "1",
        "reps": "10",
        "rest_seconds": "20"
    })

    const loadExercises = async (loadMore = false) => {
        try {
            if (loading) return;
            if (loadMore && !next) return;
            setLoading(true);

            console.log(loadMore ? "Loading next page:" : "Loading first page", next);
            let res = await getPublicExercises("", loadMore ? next : null);

            if (loadMore) {
                setExercises(prev => [...prev, ...res.data.results]);
            }
            else
                setExercises(res.data.results);

            setNext(res.data.next);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
            setIsEndReached(false);
        }
    };

    useEffect(() => {
        loadExercises();
    }, []);


    const changeValue = (field, value) => {
        setData(current => ({...current, [field]: value}));
    };
    
    const submit = async () => {
        if (!selectedExercise) {
            Alert.alert("Lỗi", "Vui lòng chọn bài tập");
            return;
        }

        try {
            await postExerciseToWorkoutPlan(workoutPlanId, {
                exercise_id: selectedExercise.id,
                duration: Number(data.duration),
                sets: Number(data.sets),
                reps: Number(data.reps),
                rest_seconds: Number(data.rest_seconds),
            });

            Alert.alert("Thành công", "Đã thêm bài tập vào kế hoạch", [
                {
                    text: "Thêm bài khác",
                    onPress: () => {
                        setSelectedExercise(null);
                        setData({
                            duration: "20",
                            sets: "1",
                            reps: "10",
                            rest_seconds: "60",
                        });
                    }
                },
                {
                    text: "Hoàn tất",
                    onPress: () => nav.popToTop()
                }
            ]);
        } catch (err) {
            console.error(err.response?.data);
            Alert.alert("Lỗi", "Không thể thêm bài tập");
        }
    };

    console.log("EXERCISE: ", selectedExercise);
    console.log("WORKOUT PLAN ID:", workoutPlanId);
    console.log("POST URL:", endpoints.workoutplanDetail(workoutPlanId));

   
    return (
        <View style={[MyStyles.container, {"flex": 2.5}]}>
            <Text style={MyStyles.title}>Thêm bài tập</Text>
            <Text style={[MyStyles.annoucement, {fontWeight: "bold"}]}>Kế hoạch: <Text style={{ fontWeight: "bold" }}>{workoutplanTitle}</Text></Text>
            <Text style={MyStyles.word}>Danh sách bài tập: <Text style={{ fontWeight: "bold" }}>{workoutplanTitle}</Text></Text>
            <FlatList 
                data={exercises}
                keyExtractor={item => item.id.toString()}
                onEndReached={() => {
                    if (next && !loading && !isEndReached) {
                        setIsEndReached(true);
                        loadExercises(true);
                    }
                }}
                onEndReachedThreshold={0.4}
                onMomentumScrollBegin={() => setIsEndReached(false)}
                ListFooterComponent={loading ? <ActivityIndicator /> : null}
                renderItem={({ item }) => (
                    
                    <TouchableOpacity
                        style={[
                            MyStyles.margin,
                            selectedExercise?.id === item.id && {
                                borderColor: "#034b25",
                                borderWidth: 2
                            }
                        ]}
                        onPress={() => setSelectedExercise(item)}
                    >   
                        <Text style={MyStyles.text}>{item.id} - {item.name}</Text>
                    </TouchableOpacity>
                )}
            />

            {selectedExercise && (
                <>
                    <Text style={[MyStyles.note, { marginTop: 15 }]}>
                        Bài tập đã chọn:{" "}
                        <Text style={{ fontWeight: "bold" }}>
                            {selectedExercise.name}
                        </Text>
                    </Text>

                    {info.map(i => (
                        <TextInput
                            key={i.field}
                            label={i.label}
                            keyboardType={i.keyboardType}
                            value={data[i.field]}
                            onChangeText={text => changeValue(i.field, text)}
                            style={{ marginBottom: 10 }}
                        />
                    ))}

                    <TouchableOpacity style={MyStyles.button} onPress={submit}>
                        <Text style={MyStyles.textButton}>Thêm vào kế hoạch</Text>
                    </TouchableOpacity>
                </>
            )}
            
        </View>
    );
};

export default ExerciseToWorkoutPlan;