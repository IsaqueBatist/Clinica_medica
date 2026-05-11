import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { TelaPlaceholder } from "../../screens/Placeholder";
import { AppHeader } from "../components/AppHeader";
import { Routes } from "../../constants/routes";
import { DashboardStackParamList } from "../types";
import { Dashboard } from "../../screens/TelaInicial/Dashboard";

const Stack =  createNativeStackNavigator<DashboardStackParamList>();

export function DashboardStack(){
  return (<Stack.Navigator screenOptions={{header: (props) => <AppHeader {...props} />}}>
    <Stack.Screen name={Routes.Dashboard} component={Dashboard} options={{title: "Início"}} />
  </Stack.Navigator>)
}