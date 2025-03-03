import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  ScrollView,
  Button,
} from "react-native";
import { Coins, Wifi } from "lucide-react-native";
import Player from "../components/cards/Player";
import { connectToSocket, socket } from "../socket";
import {
  joinRoom,
  pushUserToRoom,
} from "../gamelogic/redux/slices/socketSlice";
import { initGame } from "../gamelogic/redux/slices/cardSlice";
import { useNavigation } from "@react-navigation/native";

export default function GameLobby() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [searchingDots] = useState(new Animated.Value(0));
  const userData = useSelector((state) => {
    return state.user;
  });

  const gameData = useSelector((state) => state.game);
  const socketData = useSelector((state) => state.socket);
  const players = socketData.joinedInRoomPlayers;

  // console.log(gameData);
  // console.log(players);

  const emitJoinRoom = (roomId, userId, userName) => {
    console.log(roomId, userId, userName);
    socket.emit("join_room", {
      roomId,
      userId,
      userName,
    });
  };
  useEffect(() => {
    // Connect to Socket.IO server
    connectToSocket();

    // Socket event listeners
    socket.on("player_joined", ({ players }) => {
      // console.log("new player joined", players);

      dispatch(pushUserToRoom({ players: players }));
    });

    socket.on("player_left", ({ players: remainingPlayers }) => {
      setPlayers(remainingPlayers);
      dispatch(pushUserToRoom({ player: remainingPlayers }));
    });

    socket.on("initial_state", ({ initial_state }) => {
      // Alert.alert("Game is starting!", "All players have joined.");
      // console.log(initial_state);
      dispatch(initGame({ initialState: initial_state }));
      navigation.navigate("JSGame");
      // Navigate to game screen or start game logic here
    });

    socket.on("error", ({ message }) => {
      // Alert.alert("Error", message);
    });

    // Cleanup on unmount
    return () => {
      socket.off("player_joined");
      socket.off("player_left");
      socket.off("game_starting");
      socket.off("error");
    };
  }, []);

  function startGameButtonClick() {
    // console.log("start the game", socketData.joinedRoomId);
    socket.emit("game_start", socketData.joinedRoomId);
  }

  useEffect(() => {
    // Join room API call
    const mainjoinRoom = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/rooms/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: userData.userId,
            userName: userData.userName,
          }),
        });
        const data = await response.json();

        if (data.status === "success") {
          console.log("join room", data.roomId);
          // Join the Socket.IO room
          console.log(userData);
          emitJoinRoom(data.roomId, userData.userId, userData.userName);

          dispatch(joinRoom({ roomId: data.roomId }));
        }
      } catch (error) {
        // Alert.alert("Error", "Failed to join room");
      }
    };
    mainjoinRoom();
  }, []);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(searchingDots, {
          toValue: 3,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(searchingDots, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [searchingDots]);

  // const dots = searchingDots.interpolate({
  //   inputRange: [0, 1, 2, 3],
  //   outputRange: ["", ".", "..", "..."],
  // });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.connectionStatus}>
          <Wifi size={20} color="#4CAF50" />
        </View>
        <View style={styles.coins}>
          <Coins size={20} color="#FFD700" />
          <Text style={styles.coinsText}>2.6K</Text>
        </View>
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.title}>MULTIPLAYER</Text>
        <Text style={styles.subtitle}>HIGH FIVE</Text>
      </View>

      <ScrollView style={styles.playersContainer}>
        {players.map((player) => (
          <Player
            key={player.userId}
            name={player.userName}
            avatar="/placeholder.svg?height=60&width=60"
            score={5}
          />
        ))}
        {/* {players.length < 2 && (
          <PlayerCard name="Waiting for player..." isSearching={true} />
        )} */}
      </ScrollView>

      <View style={styles.searchingContainer}>
        <Text style={styles.searchingText}>
          {players.length < 2 ? (
            <>
              Searching for players
              {/* <Animated.Text>{dots}</Animated.Text> */}
            </>
          ) : (
            "Game starting..."
          )}
        </Text>
      </View>

      <View style={styles.searchingContainer}>
        <Text style={styles.searchingText}>
          {players.length == 4 ? (
            <>
              <View style={styles.container}>
                <Button
                  title="Start Game"
                  onPress={() => {
                    startGameButtonClick();
                  }}
                />
              </View>
              {/* <Animated.Text>{dots}</Animated.Text> */}
            </>
          ) : null}
        </Text>
      </View>

      <View style={styles.searchingContainer}>
        <Text style={styles.searchingText}>
          Waiting in room {socketData.joinedRoomId}
          {/* <Animated.Text>{dots}</Animated.Text> */}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a2c3e",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  connectionStatus: {
    flexDirection: "row",
    alignItems: "center",
  },
  coins: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    padding: 8,
    borderRadius: 20,
  },
  coinsText: {
    color: "#FFD700",
    marginLeft: 4,
    fontWeight: "bold",
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    textShadowColor: "rgba(0, 195, 255, 0.75)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 18,
    color: "#fff",
    opacity: 0.8,
  },
  playersContainer: {
    flex: 1,
    marginBottom: 20,
  },
  searchingContainer: {
    alignItems: "center",
  },
  searchingText: {
    color: "#fff",
    fontSize: 16,
    opacity: 0.8,
  },
});
