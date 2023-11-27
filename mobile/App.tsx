import React from "react";
import { StatusBar } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { NativeBaseProvider, extendTheme } from "native-base";
import Routes from "./src/routes";

const colors = {
  primary: {
    400: "#003265",
    500: "#0080ff",
    100: "#f0f6fe",
  },
  gray: {
    400: "#6C6C80",
  },
};

const theme = extendTheme({ colors: colors });

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NativeBaseProvider theme={theme}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor="transparent"
          translucent
        />
        <Routes />
      </NativeBaseProvider>
    </GestureHandlerRootView>
  );
}
