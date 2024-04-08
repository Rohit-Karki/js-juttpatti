import { StatusBar } from 'expo-status-bar';
import * as ScreenOrientation from 'expo-screen-orientation';
import {ImageBackground, StyleSheet, Text, View } from 'react-native';


async function changeScreenOrientation() {
  await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
}

export default function App() {
 changeScreenOrientation();
  return (
    <View style={styles.container}>
      <ImageBackground source={require('D:\Pygame Projects\js-juttpatti\src\assets\sprites\Board.png')} resizeMode="cover" style={styles.image}>
      <Text style={styles.text}>Inside lllllllll</Text>
      </ImageBackground>
      <StatusBar hidden/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    flex: 1,
    justifyContent: 'center',
  },
});
