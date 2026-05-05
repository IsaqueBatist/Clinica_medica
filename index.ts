// Importação OBRIGATÓRIA no topo: registra o GestureHandler nativo antes de
// qualquer view ser criada. React Navigation Drawer depende disso — sem este
// import, gestos de swipe não funcionam (e em alguns Androids quebra a tela).
import "react-native-gesture-handler";

import { registerRootComponent } from "expo";

import App from "./App";

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
