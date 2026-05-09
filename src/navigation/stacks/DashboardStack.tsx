import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { TelaPlaceholder } from "../../screens/Placeholder";
import { AppHeader } from "../components/AppHeader";
import { Routes } from "../../constants/routes";
import { DashboardStackParamList } from "../types";

const Stack =  createNativeStackNavigator<DashboardStackParamList>();

export function DashboardStack(){
  return (<Stack.Navigator screenOptions={{header: (props) => <AppHeader {...props} />}}>
    <Stack.Screen name={Routes.Dashboard} component={TelaPlaceholder} options={{title: "Início"}} />
  </Stack.Navigator>)
}