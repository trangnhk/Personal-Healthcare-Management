import { Alert, Text, TouchableOpacity, View } from "react-native";
import { createWorkoutPlan } from "../../services/workout.services";
import { useNavigation } from "@react-navigation/native";
import MyStyles from "../../styles/MyStyles";
import { useContext, useState } from "react";
import { TextInput } from "react-native-paper";
import { MyUserContext } from "../../utils/contexts";

const NewWorkoutplan = () => {
  const [title, setTitle] = useState("");
  const nav = useNavigation();
  const [user, ] = useContext(MyUserContext);
  console.log("User WorkoutPlan: ", user.id);
  
  const submit = async () => {
    if (!title){
      Alert.alert("Lỗi", "Tên kế hoạch là bắt buộc");
      return;
    }
    const form = new FormData();
    form.append("title", title);
    

    try{
      const res = await createWorkoutPlan(form);
      const workoutplan = res.data;


      Alert.alert("Thành công", "Bạn có muốn thêm bài tập vào kế hoạch này không?",
        [{
          text: "Không",
          onPress: () => nav.goBack(),
          style: "cancel",
        },
        {
          text: "Có",
          onPress: () => nav.navigate("AddExerciseToWorkoutPlan", {workoutPlanId: workoutplan.id, workoutplanTitle: workoutplan.title})
        }]
      );
    }
    catch(err){
      console.error(err.response?.data);
      Alert.alert("Lỗi", "Không thể tạo kế hoạch luyện tập");
    }
  };


  return (
    <View style={MyStyles.container}>
        <Text style={MyStyles.title}>Tạo kế hoạch tập luyện</Text>
        <Text style={[MyStyles.text, {color: "#034b25", fontWeight: "bold", margin: 10}]}>Tên kế hoạch tập luyện</Text>
        <TextInput placeholder="Tên kế hoạch tập luyện" onChangeText={setTitle}></TextInput>
        <TouchableOpacity style={MyStyles.button} onPress={submit}>
            <Text style={MyStyles.textButton}>Tạo kế hoạch tập luyện</Text>
        </TouchableOpacity>

    </View>
  );
};
export default NewWorkoutplan;