import { StyleSheet, Dimensions } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider } from "react-redux";
import { store } from "./src/gamelogic/redux/GameStore";
import JSGame from "./src/gamelogic/JSGame";

async function changeScreenOrientation() {
  await ScreenOrientation.lockAsync(
    ScreenOrientation.OrientationLock.LANDSCAPE
  );
}

export default function App() {
  changeScreenOrientation();
  return (
    <GestureHandlerRootView>
      <Provider store={store}>
        <JSGame />
      </Provider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({});
