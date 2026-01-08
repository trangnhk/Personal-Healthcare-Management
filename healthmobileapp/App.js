import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Home from "./src/screens/Home/Home";
import { MyUserContext } from "./src/utils/contexts";
import { NavigationContainer } from "@react-navigation/native";
import { View } from "react-native";
import Exercises from "./src/components/Exercises";
import ExerciseDetail from "./src/screens/Home/ExerciseDetail";

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={Exercises}
        options={{ title: "Bài tập" }}
      />
      <Stack.Screen
        name="ExerciseDetails"
        component={ExerciseDetail}
        options={{ title: "Chi tiết bài tập" }}
      />
    </Stack.Navigator>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <StackNavigator />
    </NavigationContainer>
  );
};

export default App;
