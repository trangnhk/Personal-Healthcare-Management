import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MyUserContext } from "./src/utils/contexts";
import { NavigationContainer } from "@react-navigation/native";
import Exercises from "./src/components/Exercises";
import ExerciseDetail from "./src/screens/Home/ExerciseDetail";
import Experts from "./src/components/Experts";
import MainTopTabNavigator from "./src/navigation/TopNavigation";
import MyUserReducers from "./src/reducers/MyUserReducers";
import { useEffect, useReducer, useState } from "react";

import NewWorkoutplan from "./src/screens/WorkoutPlan/NewWorkoutplan";
import WorkoutTab from "./src/components/WorkoutPlan";
import { getCurrentUser } from "./src/services/account.services";
import HealthDiaries from "./src/components/HealthDiaries";
import NewExercise from "./src/screens/Home/NewExercise";
import WorkoutPlanDetail from "./src/screens/WorkoutPlan/WorkoutPlanDetail";

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
        name="NewExercise"
        component={NewExercise}
        options={{ title: "Bài tập mới" }}
      />

      <Stack.Screen
        name="Experts"
        component={Experts}
        options={{ title: "Chuyên gia" }}
      />
      <Stack.Screen
        name="WorkoutPlans"
        component={WorkoutTab}
        options={{ title: "Kế hoạch tập luyện" }}
      />
      <Stack.Screen
        name="WorkoutPlanDetail"
        component={WorkoutPlanDetail}
        options={{ title: "Chi tiết kế hoạch" }}
      />
      <Stack.Screen
        name="NewWorkoutPlan"
        component={NewWorkoutplan}
        options={{ title: "Kế hoạch tập luyện mới" }}
      />
      <Stack.Screen
        name="HealthDiaries"
        component={HealthDiaries}
        options={{ title: "Nhật ký" }}
      />
      
    </Stack.Navigator>
  );
};

// const Tab = createBo

const App = () => {
  const [user, dispatch] = useReducer(MyUserReducers, null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await getCurrentUser();
        dispatch({ type: "login", payload: res.data });
      } catch {
        dispatch({ type: "logout" });
      }
    };
    loadUser();
  }, []);

  return (
    <MyUserContext.Provider value={[user, dispatch]}>
      <NavigationContainer>
        <StackNavigator />
      </NavigationContainer>
    </MyUserContext.Provider>
  );
};

export default App;
