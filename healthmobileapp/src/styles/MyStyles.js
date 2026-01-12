import { StyleSheet} from "react-native";

export default StyleSheet.create({
    container: {
        // flex: 1,
        backgroundColor: '#b5fde0ff',
        padding: 25,
    },
    row: {
        flexDirection: "row",
        flexWrap: 'wrap'
    },
    margin: {
        margin: 5
    },
    padding: {
        padding: 10
    },
    image: {
        width: 100, 
        height: 100,
        borderRadius: 25
    }, 
    avatar: {
        width: 300, 
        height: 300,
        borderRadius: 100
    }, 
    title: {
        fontSize: 55,
        fontWeight: "bold",
        color: "#298e7aff",
        alignSelf: "center",
        padding: 20
    },
    word:{
        fontSize: 27,
        fontWeight: "bold",
        color: "#16b494ff",
        padding: 5
    },
    note:{
        fontSize: 14,
        color: "#a98a8aff",
        fontStyle: "italic",
        padding: 7
    },
    annoucement:{
        fontSize: 20,
        color: "#ff4500ff",
        alignSelf: "center",
        fontStyle: "italic",
        padding: 10,
    },
    button:{
        margin: 10, 
        paddingVertical: 12, 
        paddingHorizontal: 18, 
        backgroundColor: "#188d66ff", 
        borderRadius: 8,
    },
    textButton:{
        color: "white",
        fontWeight: "bold",
        fontSize: 16,
        alignSelf: "center"
    },
    text: {
        fontSize: 20,
        // margin: 20
    }
}
);
