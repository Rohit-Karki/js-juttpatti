import { StyleSheet, Dimensions } from "react-native";
import { Provider } from "react-redux";
import { store } from "./src/gamelogic/redux/GameStore";
import JSGame from "./src/gamelogic/Game";

// async function changeScreenOrientation() {
//   await ScreenOrientation.lockAsync(
//     ScreenOrientation.OrientationLock.LANDSCAPE
//   );
// }

export default function App() {
  return (
    <Provider store={store}>
      <JSGame />
    </Provider>
  );
}

const styles = StyleSheet.create({});
