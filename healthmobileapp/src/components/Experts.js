import { useEffect, useState } from "react";
import { getExperts } from "../services/home.services";
import { View, Text } from "react-native";
import MyStyles from "../styles/MyStyles";

const Expert = () => {
    const [experts, setExperts] = useState([]);

    useEffect(() => {
        getExperts()
            .then(res => setExperts(res.data.results))
            .catch(err => console.log(err));
    }, []);

    return (
        <View style={MyStyles.padding}>
            {Array.isArray(experts) && experts.map(e => (
                <Text key={e.id}>{e.name}</Text>
            ))}
        </View>
    );
};

export default Exercises;
