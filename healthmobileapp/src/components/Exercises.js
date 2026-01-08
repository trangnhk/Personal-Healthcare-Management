import { useEffect, useState } from "react";
import { getPublicExercises } from "../services/home.services";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { ActivityIndicator, List, Searchbar } from "react-native-paper";
import MyStyles from "../styles/MyStyles";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const Exercises = () => {
    const [exercises, setExercises] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [next, setNext] = useState(null);
    const nav = useNavigation();

    const loadExercises = async (loadMore = false) => {
        try {
            if (loading) return;
            setLoading(true);
            let res = await getPublicExercises(search, loadMore ? next : null);

           if (loadMore) {
                setExercises(prev => {
                    const ids = new Set(prev.map(e => e.id));
                    const newItems = res.data.results.filter(e => !ids.has(e.id));
                    return [...prev, ...newItems];
                });
            }
            else
                setExercises(res.data.results);

            setNext(res.data.next);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let timer = setTimeout(() => {
            loadExercises();
        }, 500);

        return () => clearTimeout(timer);
    }, [search]);

    const renderItem = ({ item }) => (
        <TouchableOpacity activeOpacity={0.7} onPress={() =>{
            nav.navigate("ExerciseDetails", {exerciseId: item.id})
        }}>
            <List.Item style={MyStyles.padding}
                    title={item.name} titleStyle={MyStyles.word}
                    description={item.description} descriptionStyle={{fontSize: 15}}
                    left={() => <MaterialIcons name="fitness-center" size={30} color="#16b494ff"/>}
                    right={() => item.created_by ? (
                                    <View>
                                        <Text style={MyStyles.note}>Tạo bởi: {item.created_by.username}</Text>
                                    </View>
                                ) : null
                            }
        />
        </TouchableOpacity>
    );

    return (
        <View style={MyStyles.padding}>
            <Text style={MyStyles.title}>Danh sách bài tập</Text>
            <Searchbar placeholder="Tìm bài tập..." value={search} onChangeText={setSearch}/>
            <FlatList 
                data={exercises}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                onEndReached={() => {
                    if(next) loadExercises(true);
                }}
                onEndReachedThreshold={0.6}
                ListFooterComponent={loading ? <ActivityIndicator/>: null}
            />
        </View>
    );
};

export default Exercises;
