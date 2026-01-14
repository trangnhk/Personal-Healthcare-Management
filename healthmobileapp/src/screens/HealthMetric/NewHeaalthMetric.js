import { useNavigation } from "@react-navigation/native";
import { useContext, useEffect, useState } from "react";
import { Alert, FlatList, Text, TouchableOpacity, View } from "react-native";
import { MyUserContext } from "../../utils/contexts";
import { getWorkoutPlan } from "../../services/workout.services";
import { postHealthMetric } from "../../services/home.services";
import { Button, TextInput } from "react-native-paper";
import MyStyles from "../../styles/MyStyles";

const NewHealthMetric = () => {
    const nav = useNavigation();
    const [user, ] = useContext(MyUserContext);
    console.log("User HealthMetric: ", user.id);

    const info = [{
        "label": "Lượng nước uống (lít)",
        "field": "water_intake",
        "keyboardType": "numeric"
    },
    {
        "label": "Số bước chân (bước)",
        "field": "steps",
        "keyboardType": "numeric"
    },
    {
        "label": "Nhịp tim (nhịp)",
        "field": "heart_rate",
        "keyboardType": "numeric"
    },
    {
        "label": "Lượng calories tiêu thụ",
        "field": "calories",
        "keyboardType": "numeric"
    }
    ];

    const [workoutPlan, setWorkoutPlan] = useState([]);
    const [selectedWorkoutPlan, setSelectedWorkoutPlan] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isEndReached, setIsEndReached] = useState(false);
    const [next, setNext] = useState(null);

    const [data, setData] = useState({
        "water_intake": "0",
        "steps": "0",
        "heart_rate": "0",
        "calories": "0"
    })

    const loadWorkoutPlan = async (loadMore = false) => {
        try {
            if (loading) return;
            if (loadMore && !next) return;
            setLoading(true);

            console.log(loadMore ? "Loading next page:" : "Loading first page", next);
            let res = await getWorkoutPlan(loadMore ? next : null);

            if (loadMore) {
                setWorkoutPlan(prev => {
                    const ids = new Set(prev.map(p => p.id));
                    const newItems = res.data.results.filter(p => !ids.has(p.id));
                    return [...prev, ...newItems];
                });
            }
            else {
                setWorkoutPlan(res.data.results);
            }

            setNext(res.data.next);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
            setIsEndReached(false);
        }
    };

    useEffect(() => {
        loadWorkoutPlan();
    }, []);

    const changeValue = (field, value) => {
        setData(current => ({...current, [field]: value}));
    };

    const submit = async () => {
        if (!selectedWorkoutPlan){
            Alert.alert("Lỗi", "Vui lòng chọn kế hoạch luyện tập");
            return;
        }

        try{
            await postHealthMetric({workout_plan: selectedWorkoutPlan.id,
                                    water_intake: Number(data.water_intake),
                                    steps: Number(data.steps),
                                    heart_rate: Number(data.heart_rate),
                                    calories: Number(data.calories)
            });

            Alert.alert("Thành công", "Đã thêm chỉ số mới");
            nav.goBack();

        }
        catch(err){
            console.error(err.response?.data);
            Alert.alert("Lỗi", "Không thể thêm chỉ số");
        }

    };

    console.log("WORKOUT PLAN: ", selectedWorkoutPlan);


    return (
    <View style={{ flex: 2.5, padding: 16 }}>
        <Text style={MyStyles.title}>
            THÊM MỚI HEALTH METRIC
        </Text>
        <View style={{ flex: 0.7 }}>
            <Text style={MyStyles.text}>
                Chọn kế hoạch luyện tập
            </Text>

            <FlatList
                data={workoutPlan}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => setSelectedWorkoutPlan(item)}
                        style={{
                            padding: 12,
                            marginBottom: 8,
                            borderRadius: 8,
                            borderWidth: 1,
                            borderColor:
                                selectedWorkoutPlan?.id === item.id ? "#038356" : "#ccc",
                            backgroundColor:
                                selectedWorkoutPlan?.id === item.id ? "#E6F4F1" : "#fff"
                        }}
                    >
                        <Text style={{ fontWeight: "bold" }}>
                            {item.name || `Workout Plan: ${item.title}`}
                        </Text>
                    </TouchableOpacity>
                )}
                onEndReached={() => {
                    if (!loading && next) {
                        loadWorkoutPlan(true);
                    }
                }}
                onEndReachedThreshold={0.4}
                onMomentumScrollBegin={() => setIsEndReached(false)}
                ListFooterComponent={
                    loading ? <Text>Đang tải...</Text> : null
                }
            />

            {selectedWorkoutPlan && (
                <>
                    <Text style={[MyStyles.note, { marginTop: 15 }]}>Kế hoạch luyện tập đã chọn: {""}
                        <Text style={{fontWeight: "bold"}}>
                            {selectedWorkoutPlan.title}
                        </Text>
                    </Text>

                    {info.map(i => (
                        <TextInput
                            key={i.field}
                            label={i.label}
                            keyboardType={i.keyboardType}
                            value={data[i.field]}
                            onChangeText={text => changeValue(i.field, text)}
                            style={{marginBottom: 5}}
                        />
                    ))}
                </>
            )}
        </View>

        <TouchableOpacity style={MyStyles.button} onPress={submit} disabled={!selectedWorkoutPlan}>
            <Text style={MyStyles.textButton}>Thêm chỉ số</Text>
        </TouchableOpacity>
    </View>
);

};

export default NewHealthMetric;