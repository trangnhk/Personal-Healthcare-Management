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
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 50
    }, 
    title: {
        fontSize: 49,
        fontWeight: "bold",
        color: "#298e7aff",
        alignSelf: "center",
        padding: 25
    },
    word:{
        fontSize: 23,
        fontWeight: "bold",
        color: "#16b494ff",
        padding: 1
    },
    note:{
        fontSize: 14,
        color: "#a98a8aff",
        fontStyle: "italic",
        padding: 3
    }
}
);
