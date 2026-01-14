import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { useCallback, useContext, useEffect, useState } from "react";
import { MyUserContext } from "../utils/contexts";
import { getReminders, postSetDoneReminders } from "../services/reminder.services";
import { Alert, FlatList, View } from "react-native";
import { ActivityIndicator, Icon, List, Switch, Text } from "react-native-paper";
import MyStyles from "../styles/MyStyles";
import { formatDateTime } from "../utils/utilFunctions";

const Reminders = () => {
    const route = useRoute();
    const workoutPlanId = route.params?.workoutPlanId;
    const workoutPlanTitle = route.params?.workoutPlanTitle;
    const [reminders, setReminders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [next, setNext] = useState(null);
    const [isEndReached, setIsEndReached] = useState(false);
    const nav = useNavigation();
    const user = useContext(MyUserContext);
    const [isSwitchOn, setIsSwitchOn] = useState(false);


    if (!user) return;

    const loadReminders = async (loadMore = false) => {
        try {
            if (loading) return;
            if (loadMore && !next) return;
            setLoading(true);

            let res = await getReminders(loadMore ? next : null);

            if (loadMore){
                setReminders(prev => {
                    const ids = new Set(prev.map(e => e.id));
                    const newItems = res.data.results.filter(e => !ids.has(e.id));
                    return [...prev, ...newItems];
                });
            }
            else{
                setReminders(res.data.results);
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
        setReminders([]);
        setNext(null);
        setIsEndReached(false);
        loadReminders();
    },[])
    );

    console.log("REMINDERS: ", reminders);

    const onToggleSwitch = async (reminderId, newValue) => {
        if (newValue) return;
        
        Alert.alert("Xác nhận", "Khi hoàn thành bạn sẽ không thể bật lại",
            [
                {
                    text: "Hủy",
                    style: "cancel",
                },
                {
                    text: "Đồng ý",
                    onPress: async () => {
                        try {
                            await postSetDoneReminders(reminderId);

                            Alert.alert("Thành công", "Đã hoàn thành lời nhắc");

                            setReminders(prev =>
                                prev.map(r => r.id === reminderId
                                        ? { ...r, is_done: true }
                                        : r
                                )
                            );
                        } catch (err) {
                            console.error(err.response?.data);
                            Alert.alert("Lỗi", "Thực hiện thay đổi không thành công");
                        }
                    },
                },
            ]
        );
    };
    // console.log("SWITCH is done: ", isSwitchOn);

    const renderItem = ({item}) => (
        <List.Accordion title={formatDateTime(item.remind_at)} titleStyle={[MyStyles.annoucement, {fontWeight: "bold"}]}>
            <List.Item title={`Lời nhắc: ${item.message}`}
                    titleStyle={[MyStyles.text]}
                    right={() => {
                        return <Switch value={!item.is_done} style={MyStyles.padding} onValueChange={(newValue) => onToggleSwitch(item.id, newValue)}/>
                    }}
                    style={MyStyles.padding}
                    left={() => <Icon source={"message-alert"} size={30}/>}/>
        </List.Accordion>
    );


    return (
        <View style={[MyStyles.container, {flex: 2}]}>
            <Text style={MyStyles.title}>BÁO THỨC CỦA TÔI</Text>

            <View style={{flex: 0.7}}>
                <FlatList data={reminders}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id.toString()}
                        onEndReached={() => {
                            if (next && !loading && !isEndReached) {
                                setIsEndReached(true);
                                loadReminders(true);
                            }
                        }}
                        onEndReachedThreshold={0.4}
                        onMomentumScrollBegin={() => setIsEndReached(false)}
                        ListFooterComponent={loading ? <ActivityIndicator/> : null}
                />
            </View>
        </View>
    );
};

export default Reminders;