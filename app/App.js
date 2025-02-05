import { StyleSheet, Dimensions } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider } from "react-redux";
import { store } from "./src/gamelogic/redux/GameStore";
import RootStack from "./src/screens/RootStack";

async function changeScreenOrientation() {
  await ScreenOrientation.lockAsync(
    ScreenOrientation.OrientationLock.LANDSCAPE
  );
}

export default function App() {
  // changeScreenOrientation();
  return (
    <GestureHandlerRootView>
      <Provider store={store}>
        <NavigationContainer>
          <RootStack />
        </NavigationContainer>
      </Provider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({});
