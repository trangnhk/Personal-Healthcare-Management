import { useNavigation } from "@react-navigation/native";
import { useContext, useEffect, useState } from "react";
import { Button, Text, TouchableOpacity, View, FlatList } from "react-native";
import MyStyles from "../styles/MyStyles";
import { ActivityIndicator, List } from "react-native-paper";
import { getWorkoutPlan } from "../services/workout.services";
import { MyUserContext } from "../utils/contexts";

const WorkoutTab = () => {
    const [workoutplans, setWorkoutplans] = useState([]);
    const [user, dispatch] = useContext(MyUserContext);
    const [loading, setLoading] = useState(false);
    const [next, setNext] = useState(null);
    const [isEndReached, setIsEndReached] = useState(false);
    const nav = useNavigation();
    

    // console.log("USER: ", user)

    const loadWorkoutplans = async(loadMore = false) => {
        try{
            if (loading) return;
            if (loadMore && ! next) return;
            setLoading(true);
            console.log(loadMore ? "Loading next page:" : "Loading first page", next);
            let res = await getWorkoutPlan(loadMore ? next : null);

            if (loadMore){
                setWorkoutplans(prev => {
                    const ids = new Set(prev.map(e => e.id));
                    const newItems = res.data.results.filter(e => !ids.has(e.id));
                    return [...prev, ...newItems];
                });
            }
            else{
                setWorkoutplans(res.data.results);
            }
            setNext(res.data.next);
            
        }
        catch (err){
            console.log(err);

        }finally{
            setLoading(false);
            setIsEndReached(false)
        }

    };

    useEffect(() => {
        loadWorkoutplans();
    }, []);
    

    const renderItem = ({item}) => (
        <TouchableOpacity activeOpacity={0.7} onPress={() =>{
            nav.navigate("WorkoutPlanDetail", {workoutplanId: item.id})
        }}>
            <List.Item style={MyStyles.padding}
                    title={item.title} titleStyle={MyStyles.word}
                    description={item.created_date}
                    right={() =>
                        item.expert ? (
                            <Text style={MyStyles.note}>
                                Được tạo bởi chuyên gia: {item.expert}
                            </Text>
                        ) : null
                    }
            />
            

        </TouchableOpacity>

        );



    return (
        <View style={MyStyles.padding}>
            <Text style={MyStyles.title}>Kế hoạch tập luyện của tôi</Text>

            {user ? (
                <FlatList 
                data={workoutplans}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                onEndReached={() => {
                    if (next && !loading && !isEndReached) {
                        setIsEndReached(true);
                        loadWorkoutplans(true);
                    }
                }}
                onEndReachedThreshold={0.4}
                onMomentumScrollBegin={() => setIsEndReached(false)}
                ListFooterComponent={loading ? <ActivityIndicator/>: null}
                />
            
            ): null}

            <TouchableOpacity onPress={() => {nav.navigate('NewWorkoutPlan')}} style={MyStyles.button}>
                <Text style={MyStyles.textButton}>Tạo kế hoạch luyện tập mới</Text>
            </TouchableOpacity>
            
        </View>
    );
};

export default WorkoutTab;
