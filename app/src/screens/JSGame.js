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
import Card from "../components/cards/Card";
import { ImagesAssets } from "../../assets";
import { initGame } from "../gamelogic/redux/slices/cardSlice";
import PlayerCardGroup from "../components/cards/PlayerCardGroup";

export default function JSGame() {
  const dispatch = useDispatch();
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");

  const state = useSelector((state) => {
    return state.game;
  });

  const userState = useSelector((state) => {
    return state.user;
  });

  console.log(state);
  console.log(userState);

  useEffect(() => {
    if (!socket.connected) {
      // console.log("Connect")
      // onConnect();
    }
    // console.log(socket.active);
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  const player = state.players.find((p) => p.userId === userState.userId);
  console.log(player);

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/sprites/Board.png")}
        // resizeMode="cover"
        style={styles.boardImage}
      />

      <View style={styles.cards}>
        <PlayerCardGroup playerCards={player.cards} />

        {/* 

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
        <Card imageSrc={ImagesAssets.Clovers_4_white} /> */}
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
