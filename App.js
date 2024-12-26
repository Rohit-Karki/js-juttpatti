import { StatusBar } from "expo-status-bar";
import * as ScreenOrientation from "expo-screen-orientation";
import { ImageBackground, Image, StyleSheet, Text, View } from "react-native";
import { Provider } from "react-redux";
import { store } from "./src/gamelogic/redux/GameStore";

async function changeScreenOrientation() {
  await ScreenOrientation.lockAsync(
    ScreenOrientation.OrientationLock.LANDSCAPE
  );
}

export default function App() {
  changeScreenOrientation();
  return (
    <Provider store={store}>
      <View style={styles.container}>
        <ImageBackground
          source={require("./assets/sprites/Board.png")}
          resizeMode="cover"
          style={styles.image}
        >
          <Image source={require("./assets/sprites/Clovers_2_white.png")} style={styles.cardImage} />
        </ImageBackground>
        <StatusBar hidden />
      </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    // alignItems: 'center',
    justifyContent: "center",
  },
  image: {
    flex: 1,
    justifyContent: "center",
  },
  cardImage:{
    width: "200px",
    height: "200px",
  }
});
