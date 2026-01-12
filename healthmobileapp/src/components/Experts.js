import { useContext, useEffect, useState } from "react";
import { getExpertDetail, getExperts } from "../services/home.services";
import { View, Text, Image, ScrollView, FlatList, Touchable, TouchableOpacity } from "react-native";
import MyStyles from "../styles/MyStyles";
import { ActivityIndicator, Button, List, Modal, PaperProvider, Portal } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { endpoints } from "../services/Endpoints";
import { MyUserContext } from "../utils/contexts";

const Experts = () => {
    const [experts, setExperts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [visible, setVisible] = useState(false);
    const [selectedExpert, setSelectedExpert] = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const [user, dispatch] = useContext(MyUserContext);

    const nav = useNavigation();

    // Danh sach Experts
    const loadExperts = async () => {
        try{
            setLoading(true);
            let res = await getExperts()
            setExperts(res.data);
        }catch(err){
            console.log(err);
        }finally{
            setLoading(false);
        }
    };

    useEffect(() => {
        loadExperts();
    }, []);


    // apply display modal detail expert
    const showModal = async (expertId) => {
        setDetailLoading(true);
        setSelectedExpert(null);
        setVisible(true); 
        try {
            console.log("Request URL:", endpoints.expertDetail(expertId));
            const res = await getExpertDetail(expertId);
            console.log("Expert detail:", res.data);
            setSelectedExpert({ ...res.data, ...experts.find(e => e.id === expertId) });
            setVisible(true);
        } catch (err) {
            console.log("Load expert detail error:", err);
            setSelectedExpert(null);
            setVisible(true);
        } finally {
            setDetailLoading(false);
        }
    };


    const hideModal = () => {
        setVisible(false);
        setSelectedExpert(null);
    }

    const renderItem = ({ item }) => (
        
        <TouchableOpacity activeOpacity={0.7} onPress={() => showModal(item.id)}>
            <List.Item
                title={item.username}
                titleStyle={MyStyles.word}
                descriptionStyle={{ fontSize: 15 }}
                left={() => {
                    if (item.avatar)
                        return (
                            <Image
                                source={{ uri: item.avatar }}
                                style={MyStyles.image}
                            />
                        );
                    return <MaterialIcons name="account-circle" size={100} color="#16b494ff" />;
                }}
            />
            
        </TouchableOpacity>
        
    );

    return (
        <PaperProvider>
            <View style={MyStyles.padding}>
                <Text style={MyStyles.title}>Danh sách chuyên gia</Text>
                <FlatList
                    data={experts}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingVertical: 10 }}
                    ListFooterComponent={loading ? <ActivityIndicator size="large" style={{ margin: 20 }} /> : null}
                />
                <Portal>
                    <Modal
                        visible={visible}
                        onDismiss={hideModal}
                        contentContainerStyle={{ backgroundColor: 'white', padding: 20, borderRadius: 10, maxHeight: 600 }}
                    >
                        {detailLoading ? (
                            <ActivityIndicator size="large" style={{ margin: 20 }} />
                        ) : selectedExpert ? (
                            <View>
                                {/* console.log("Selected Expert: ", selectedExpert); */}
                                <View style={MyStyles.row} justifyContent="center" alignItems="center" >
                                    {selectedExpert.avatar ? (
                                        <Image source={{ uri: selectedExpert.avatar }} style={MyStyles.avatar} />
                                    ) : (
                                        <MaterialIcons name="account-circle" size={200} color="#16b494ff" />
                                    )}
                                    <View style={MyStyles.padding}>
                                        <Text style={MyStyles.title}>{selectedExpert.username}</Text>
                                        <Text style={{fontSize: 17}}>Họ: {selectedExpert.last_name || "-"}</Text>
                                        <Text style={{fontSize: 17}}>Tên: {selectedExpert.first_name || "-"}</Text>
                                        <Text style={{fontSize: 17}}>Thông tin: {selectedExpert.expert_profile?.bio || "-"}</Text>
                                        <Text style={{fontSize: 17}}>Kinh nghiệm: {selectedExpert.expert_profile?.experience || "-"}</Text>
                                        <Text style={{fontSize: 17}}>
                                            Đánh giá: {selectedExpert.expert_profile?.rating || "-"}
                                            <MaterialIcons name="star" size={20} color="#f1c40f" />
                                        </Text>
                                        
                                    </View>
                                    
                                </View>
                                
                                {!user && (
                                    <TouchableOpacity>
                                        <Text style={MyStyles.annoucement} fontWeight="bold">Đăng nhập để kết nối với chuyên gia (Click tại đây)</Text>
                                    </TouchableOpacity>
                                )}
                                <Button mode="contained" onPress={hideModal} style={{ marginTop: 20 }}>Đóng</Button>
                            </View>
                        ) : (
                            <Text>Không có thông tin chuyên gia.</Text>
                        )}
                    </Modal>
                </Portal>
            </View>
        </PaperProvider>
        
    );
};

export default Experts;
