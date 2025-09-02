import { useEffect, useState } from "react";
import { View, StyleSheet, Alert, Button, TextInput } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { connectToSocket, socket } from "../socket";
import { useNavigation } from "@react-navigation/native";
import { initGame } from "../gamelogic/redux/slices/cardSlice";

export default function JoinRoom() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const userData = useSelector((state) => state.user);
  const [roomCode, setRoomCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleJoinGame = async () => {
    // if (!roomCode.trim()) {
    //   // Alert.alert("Error", "Please enter a game code");
    //   return;
    // }

    setLoading(true);

    try {
      // Connect socket if not connected
      if (!socket.connected) {
        socket.connect();
      }
      console.log("roomId");
      console.log("roomId", roomCode);

      // Join the socket room
      socket.emit("join_room", {
        roomId: roomCode,
        userId: userData.userId,
        userName: userData.userName,
      });
      console.log("joining rooms");

      // Navigate to the multiplayer lobby
      // navigation.navigate("MultiplayerLobby", {
      //   roomId: gameCode,
      // });
    } catch (error) {
      // Alert.alert("Error", "Failed to join game");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    connectToSocket();
    socket.on("initial_state", ({ initial_state }) => {
      // Alert.alert("Game is starting!", "All players have joined.");
      console.log(initial_state);
      dispatch(initGame({ initialState: initial_state }));
      // Navigate to game screen or start game logic here
      navigation.navigate("JSGame");
    });
  }, []);

  return (
    <View style={styles.container}>
      <TextInput
        label="Room Code"
        onChangeText={setRoomCode}
        value={roomCode}
        placeholder="Enter room code"
      />
      <Button
        title="Join Game"
        onPress={() => {
          handleJoinGame();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
});
