import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useCallback, useContext, useEffect, useState } from "react";
import { Alert, FlatList, Text, TouchableOpacity, View } from "react-native";
import { MyUserContext } from "../utils/contexts";
import { destroyHealthMetric, getHealthMetrics } from "../services/home.services";
import { TouchableHighlight } from "react-native";
import { ActivityIndicator, Button, Icon, List } from "react-native-paper";
import MyStyles from "../styles/MyStyles";
import { formatDateTime } from "../utils/utilFunctions";

const HealthMetric = () => {
    const [healthMetrics, setHealthMetrics] = useState([]);
    const [loading, setLoading] = useState(false);
    const [next, setNext] = useState(null);
    const [isEndReached, setIsEndReached] = useState(false);
    const nav = useNavigation();
    const user = useContext(MyUserContext);

    if (!user) return;

    const loadHealthMetrics = async (loadMore = false) => {
        try {
            if (loading) return;
            if (loadMore && !next) return;
            setLoading(true);

            let res = await getHealthMetrics(loadMore ? next : null);

            if (loadMore){
                setHealthMetrics(prev => {
                    const ids = new Set(prev.map(e => e.id));
                    const newItems = res.data.results.filter(e => !ids.has(e.id));
                    return [...prev, ...newItems];
                });
            }
            else{
                setHealthMetrics(res.data.results);
            }
            setNext(res.data.next);
        }
        catch (err){
            console.error(err);
        }
        finally{
            setLoading(false);
            setIsEndReached(false);
        }
    }

    useFocusEffect(useCallback(() => {
        setHealthMetrics([]);
        setNext(null);
        setIsEndReached(false);
        loadHealthMetrics();
    }, [])
    );

    const groupByWorkoutPlan = (data) => {
        return data.reduce((acc, item) => {
            const key = item.workout_plan;
            if (!acc[key]) acc[key] = [];
            acc[key].push(item);
            return acc;
        }, {});
    };

    const groupedMetrics = groupByWorkoutPlan(healthMetrics);

    const deleteHealthMetric = (id) => {
        Alert.alert(
            "Xác nhận",
            "Bạn có chắc chắn muốn xóa hay không?",
            [
                {
                    text: "Không",
                    style: "cancel"
                },
                {
                    text: "Có",
                    onPress: async () => {
                        try {
                            await destroyHealthMetric(id);

                            setHealthMetrics(prev =>
                                prev.filter(m => m.id !== id)
                            );

                            Alert.alert("Thành công", "Đã xóa thành công");
                        }
                        catch (err) {
                            console.error(err.response?.data);
                            Alert.alert("Lỗi", "Xóa không thành công");
                        }
                    }
                }
            ]
        );
    };



    const renderItem = ({item}) => (
        <List.AccordionGroup>
            
                <List.Accordion
                    key={item.id}
                    id={item.id.toString()}
                    title={formatDateTime(item.recorded_at)}
                    titleStyle={MyStyles.text}
                    left={() => <Icon source={"calendar"} size={30}/>}
                >
                    <List.Item
                        title={`Nước uống: ${item.water_intake} lít`}
                        titleStyle={{fontWeight: "bold", color: '#038356'}}
                        left={() => <Icon source={"cup-water"} size={25} style={MyStyles.padding}/>}
                    />
                    <List.Item
                        title={`Bước chân: ${item.steps} bước`}
                        titleStyle={{fontWeight: "bold", color: '#038356'}}
                        left={() => <Icon source={"foot-print"} size={25} style={MyStyles.padding}/>}
                    />
                    <List.Item
                        title={`Nhịp tim: ${item.heart_rate} nhịp`}
                        titleStyle={{fontWeight: "bold", color: '#038356'}}
                        left={() => <Icon source={"heart"} size={25} style={MyStyles.padding}/>}
                    />

                    <Button textColor="red" onPress={() => deleteHealthMetric(item.id)}>Xóa</Button>
                </List.Accordion>
        </List.AccordionGroup>
    );



    return (
        <View style={MyStyles.padding}>
            <View style={MyStyles.row}  justifyContent="space-between" alignItems="center">
                <Text style={MyStyles.title}>CHỈ SỐ SỨC KHỎE</Text>
                <TouchableOpacity style={MyStyles.button} onPress={() =>{ nav.navigate("NewHealthMetric")}}>
                    <Text icon="plus" style={MyStyles.textButton}>Thêm chỉ số</Text>
                </TouchableOpacity>
            </View>

            {Object.entries(groupedMetrics).map(([workoutPlanId, metrics]) => (
                <View key={workoutPlanId} style={{ marginBottom: 16 }}>
                    <Text style={MyStyles.word}>
                        Workout Plan #{workoutPlanId}
                    </Text>
                    <FlatList
                        data={metrics}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id.toString()}
                        onEndReached={() => {
                            if (next && !loading && !isEndReached) {
                                setIsEndReached(true);
                                loadHealthMetrics(true);
                            }
                        }}
                        onEndReachedThreshold={0.4}
                        onMomentumScrollBegin={() => setIsEndReached(false)}
                        ListFooterComponent={loading ? <ActivityIndicator/> : null}
                        >

                    </FlatList>
                    
                </View>
            ))}
        </View>
    );
};

export default HealthMetric;