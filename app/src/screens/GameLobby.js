import { useState, useEffect } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { Coins, Wifi } from "lucide-react-native";
import PlayerCard from "../components/cards/PlayerCard";
import { socket } from "../socket";
import { useDispatch, useSelector } from "react-redux";
import { joinRoom } from "../gamelogic/redux/slices/socketSlice";

export default function GameLobby() {
  const dispatch = useDispatch();
  const [searchingDots] = useState(new Animated.Value(0));
  const userData = useSelector((state) => {
    return state.user;
  });

  const gameData = useSelector((state) => state.game);
  const socketData = useSelector((state) => state.socket);

  console.log(gameData);
  console.log(socketData);

  const emitJoinRoom = (roomId, userId, userName) => {
    console.log(roomId, userId, userName);
    socket.emit("join_room", {
      roomId,
      userId,
      userName,
    });
  };
  const socketListenerForPlayers = () => {
    // Connect to Socket.IO server
    connectToSocket();

    // Socket event listeners
    socket.on("player_joined", ({ players: newPlayers }) => {
      console.log("new player joined", players);

      // setPlayers(newPlayers);
    });

    socket.on("player_left", ({ players: remainingPlayers }) => {
      setPlayers(remainingPlayers);
    });

    socket.on("game_starting", ({ players: gamePlayers }) => {
      // Alert.alert("Game is starting!", "All players have joined.");
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
  };

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
        dispatch(joinRoom({ roomId: data.roomId }));

        console.log(data);

        if (data.status === "success") {
          console.log("join room", data.roomId);
          // Join the Socket.IO room
          console.log(userData);
          emitJoinRoom(data.roomId, userData.userName, userData.userId);

          socketListenerForPlayers();
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

      <View style={styles.playersContainer}>
        <PlayerCard
          name={userData.userName}
          score={5}
          avatar="/placeholder.svg?height=60&width=60"
        />
        <View style={styles.searchingIcon}>
          <View style={styles.globeContainer}>
            {/* You would replace this with an actual globe icon or animation */}
            <View style={styles.globe} />
            <View style={styles.searchIndicator} />
          </View>
        </View>
        <PlayerCard
          name={`Waiting in room ...${socketData.joinedRoomId}`}
          isSearching={true}
        />
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
    marginBottom: 40,
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
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  searchingIcon: {
    marginHorizontal: 20,
  },
  globeContainer: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  globe: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#4CAF50",
  },
  searchIndicator: {
    position: "absolute",
    bottom: -5,
    right: -5,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
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
