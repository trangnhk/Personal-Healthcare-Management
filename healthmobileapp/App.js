import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Home from "./src/screens/Home/Home";
import { MyUserContext } from "./src/utils/contexts";
import { NavigationContainer } from "@react-navigation/native";
import { View } from "react-native";
import Exercises from "./src/components/Exercises";
import ExerciseDetail from "./src/screens/Home/ExerciseDetail";
import Experts from "./src/components/Experts";
import ExpertDetail from "./src/screens/Home/ExpertDetail";
import MainTopTabNavigator from "./src/navigation/TopNavigation";
import MyUserReducers from "./src/reducers/MyUserReducers";
import { useReducer } from "react";

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
          name="MainTabs"
          component={MainTopTabNavigator}
          options={{ headerShown: false }}
        />
      <Stack.Screen
        name="Exercises"
        component={Exercises}
        options={{ title: "Bài tập" }}
      />
      <Stack.Screen
        name="ExerciseDetails"
        component={ExerciseDetail}
        options={{ title: "Chi tiết bài tập" }}
      />
      <Stack.Screen
        name="Experts"
        component={Experts}
        options={{ title: "Chuyên gia" }}
      />
      
    </Stack.Navigator>
  );
};

// const Tab = createBo

const App = () => {
  const [user, dispatch] = useReducer(MyUserReducers, null);
  return (
    <MyUserContext.Provider value={[user, dispatch]}>
      <NavigationContainer>
        <StackNavigator />
      </NavigationContainer>
    </MyUserContext.Provider>
  );
};

export default App;
