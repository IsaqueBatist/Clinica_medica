import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { TelaLogin } from "../../screens/Login/TelaLogin";
import { DashboardStackParamList } from "../types";

const Stack = createNativeStackNavigator();

export function StackLogin() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={TelaLogin} />
    </Stack.Navigator>
  );
}
