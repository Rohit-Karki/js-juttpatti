import { useState } from "react";
import { View, StyleSheet, Alert, Button, TextInput } from "react-native";
import { useSelector } from "react-redux";
import { socket } from "../socket";

export default function JoinRoom() {
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
