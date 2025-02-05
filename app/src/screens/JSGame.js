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
import { useDispatch, useSelector } from "react-redux";
import { socket } from "../socket";
import Card from "../gamelogic/Card";
import { ImagesAssets } from "../../assets";
import { initGame } from "../gamelogic/redux/slices/cardSlice";

export default function JSGame() {
  const dispatch = useDispatch();
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

      socket.emit("game_start");
    }
    function onDisconnect() {
      setIsConnected(false);
      setTransport("N/A");
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    socket.on("initial_state", (value) => {
      setInitialState(value);
    });

    console.log(state);
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  function setInitialState(initial_state) {
    // get the initial state from the server and use that to
    dispatch(initGame(initial_state));

    // socket.emit("hello", "world");

    // socket.emit("initial_state", state);
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
            console.log("pick card");
            socket.emit("pick_card", {
              playerId: "rohit123",
              pickedCard: {
                number: 4,
                type: "spades",
                color: "red",
              },
            });
          }}
        >
          <Card imageSrc={ImagesAssets.Clovers_4_white} />
        </Button>
        <Card imageSrc={ImagesAssets.Clovers_4_white} />
        <Card imageSrc={ImagesAssets.Clovers_4_white} />
        <Card imageSrc={ImagesAssets.Clovers_4_white} />
        <Card imageSrc={ImagesAssets.Clovers_4_white} />
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
    // gap: 0.5,
  },
  imageContainer: {
    width: 200,
    height: 200,
  },
  cardImage: {
    resizeMode: "contain",
    width: 100,
    height: 100,
  },
});
