import { useState, useEffect } from "react";
import {
  Image,
  Text,
  View,
  StyleSheet,
  Dimensions,
  Button,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSelector } from "react-redux";
import { socket } from "./../socket";

export default function JSGame() {
  // changeScreenOrientation();
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");

  const state = useSelector((state) => {
    return state.game;
  });
  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }
    // console.log(socket.active);

    function onConnect() {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);

      socket.io.engine.on("upgrade", (transport) => {
        setTransport(transport.name);
      });
    }
    function onDisconnect() {
      setIsConnected(false);
      setTransport("N/A");
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    console.log(state);
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  function sendInitialState() {
    socket.emit("hello", "world");

    socket.emit("initial_state", state);
  }

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/sprites/Board.png")}
        // resizeMode="cover"
        style={styles.boardImage}
      />

      <View style={styles.cards}>
        <Button
          onPress={() => {
            console.log("Board");
            sendInitialState();
          }}
        >
          <Image
            style={styles.cardImage}
            source={require("../../assets/sprites/Clovers_2_white.png")}
          />
        </Button>
        <Image
          style={styles.cardImage}
          source={require("../../assets/sprites/Clovers_3_white.png")}
        />
        <Image
          style={styles.cardImage}
          source={require("../../assets/sprites/Clovers_4_white.png")}
        />
        <Image
          style={styles.cardImage}
          source={require("../../assets/sprites/Clovers_4_white.png")}
        />
        <Image
          style={styles.cardImage}
          source={require("../../assets/sprites/Clovers_4_white.png")}
        />
      </View>
      <View>
        <Text>Status: {isConnected ? "connected" : "disconnected"}</Text>
        <Text>Transport: {transport}</Text>
      </View>
      <StatusBar hidden />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#aaa",
    alignItems: "center",
    justifyContent: "center",
  },
  boardImage: {
    position: "absolute",
    // flex: 1,
    // display: "flex",
    // alignItems: "center",
    // justifyContent: "center",
    width: 800,
    height: 400,
    resizeMode: "center",
  },
  cards: {
    width: Dimensions.get("window").height,
    zIndex: 100,
    position: "absolute",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    // left: 100,
    bottom: 20,
    gap: 0.5,
  },
  cardImage: {
    resizeMode: "center",
    width: 60,
    height: 80,
  },
});
