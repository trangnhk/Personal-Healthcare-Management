import { useEffect, useState } from "react";
import { getPublicExercises } from "../services/home.services";
import { View, Text, TouchableOpacity, FlatList, Image } from "react-native";
import { ActivityIndicator, Button, List, Searchbar } from "react-native-paper";
import MyStyles from "../styles/MyStyles";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const Exercises = () => {
    const [exercises, setExercises] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [next, setNext] = useState(null);
    const [isEndReached, setIsEndReached] = useState(false);
    const nav = useNavigation();

    const loadExercises = async (loadMore = false) => {
        try {
            if (loading) return;
            if (loadMore && !next) return;
            setLoading(true);

            console.log(loadMore ? "Loading next page:" : "Loading first page", next);
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
            setIsEndReached(false);
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
                    left={() => {
                        if(item.image)
                            return <Image source={{uri: item.image}} style={{width: 100, height: 100, borderRadius: 20}}/>;    
                        return <MaterialIcons name="fitness-center" size={100} color="#16b494ff"/>;
                    }}
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
            <View style={MyStyles.row}  justifyContent="space-between" alignItems="center">
                <Text style={MyStyles.title}>Danh sách bài tập</Text>
                <TouchableOpacity style={MyStyles.button} onPress={() => {}}>
                    <Text icon="plus" style={MyStyles.textButton}>Tạo kế hoạch luyện tập</Text>
                </TouchableOpacity>
                
            </View>

            <View style={[MyStyles.padding, { flexDirection: "row", alignItems: "center", marginVertical: 10 }]}>
                <TouchableOpacity style={MyStyles.button} onPress={() => {}}>
                    <Text style={MyStyles.textButton}>THÊM MỚI</Text>
                </TouchableOpacity>
                <Searchbar placeholder="Tìm bài tập..." value={search} onChangeText={setSearch}  style={{ flex: 1 }}/>
            </View>
            
            <FlatList 
                data={exercises}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                onEndReached={() => {
                    if (next && !loading && !isEndReached) {
                        setIsEndReached(true);
                        loadExercises(true);
                    }
                }}
                onEndReachedThreshold={0.4}
                onMomentumScrollBegin={() => setIsEndReached(false)}
                ListFooterComponent={loading ? <ActivityIndicator/>: null}
            />
        </View>
    );
};

export default Exercises;
