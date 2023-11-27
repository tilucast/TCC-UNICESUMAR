import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";

import CreateBusiness from "./pages/CreateBusiness";
import Detail from "./pages/Detail";
import Empresas from "./pages/Empresas";
import Home from "./pages/Home";

const AppStack = createNativeStackNavigator<RootStackParamList>();

const Routes = () => {
  return (
    <NavigationContainer>
      <AppStack.Navigator
        screenOptions={{ header: () => <></> }}
        initialRouteName="Home"
      >
        <AppStack.Screen name="Home" component={Home} />
        <AppStack.Screen name="Empresas" component={Empresas} />
        <AppStack.Screen name="Detail" component={Detail} />
        <AppStack.Screen name="CreateBusiness" component={CreateBusiness} />
      </AppStack.Navigator>
    </NavigationContainer>
  );
};

export default Routes;

type RootStackParamList = {
  Home: undefined;
  CreateBusiness: undefined;
  Empresas: {
    uf: string;
    city: string;
  };
  Detail: {
    empresaId: number;
  };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
