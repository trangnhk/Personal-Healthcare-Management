import { useCallback, useContext, useState } from "react";
import { ActivityIndicator, FlatList, Image, Text, TouchableOpacity, View, useWindowDimensions } from "react-native";
import { MyUserContext } from "../utils/contexts";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { getHealthDiaries } from "../services/home.services";
import { Icon, List } from "react-native-paper";
import MyStyles from "../styles/MyStyles";
import RenderHtml from 'react-native-render-html';
import MaterialIcons from "@react-native-vector-icons/material-icons";



const HealthDiaries = () => {
    const [healthDiaries, setHealthDiaries] = useState([]);
    const [loading, setLoading] = useState(false);
    const [next, setNext] = useState(null);
    const [isEndReached, setIsEndReached] = useState(false);
    const nav = useNavigation();
    const user = useContext(MyUserContext);
    const { width } = useWindowDimensions();


    const loadHealthDiaries = async (loadMore = false) => {
        try {
            if (loading) return;
            if (loadMore && !next) return;
            setLoading(true);

            let res = await getHealthDiaries(loadMore ? next : null);

            if (loadMore){
                setHealthDiaries(prev => {
                    const ids = new Set(prev.map(e => e.id));
                    const newItems = res.data.results.filter(e => !ids.has(e.id));
                    return [...prev, ...newItems];
                });
            }
            else{
                setHealthDiaries(res.data.results);
            }
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
        setHealthDiaries([]);
        setNext(null);
        setIsEndReached(false);

        loadHealthDiaries(false);
        }, [])
    );

    const renderItem= ({item}) => (
        <TouchableOpacity activeOpacity={0.7} onPress={() => nav.navigate("HealthDiaryDetail")}>
            
            <List.Accordion
                title={`Workout plan ${item.workout_plan}`}
                left={() =>
                    item.image ? (
                        <Image
                            source={{ uri: item.image }}
                            style={{ width: 50, height: 50, borderRadius: 8 }}
                        />
                    ) : (
                        <MaterialIcons name="notebook" size={40} color="#16b494ff" />
                    )
                }
            >
                <List.Item title={`Ngày tạo: ${item.created_date}`} 
                            left={() => <Icon source={"calendar"} size={30}/>} 
                />

                <View style={{ padding: 10 }}>
                    <RenderHtml
                        contentWidth={width}
                        source={{ html: item.content }}
                        ignoredDomTags={["svg", "path", "circle", "polygon",]}
                    />
                </View>
            </List.Accordion>


        </TouchableOpacity>
    );
    console.log("HEALTH DIARY: ", healthDiaries);


    return (
        <View style={MyStyles.padding}>
            <Text style={MyStyles.title}>Nhật ký của tôi</Text>
            {user ? (
                <FlatList data={healthDiaries}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                    onEndReached={() => {
                            if (next && !loading && !isEndReached) {
                                setIsEndReached(true);
                                loadHealthDiaries(true);
                        }
                    }}
                    onEndReachedThreshold={0.4}
                    onMomentumScrollBegin={() => setIsEndReached(false)}
                    ListFooterComponent={loading ? <ActivityIndicator/> : null}
            
            />
            ): null}
            
        </View>
    );
};

export default HealthDiaries;