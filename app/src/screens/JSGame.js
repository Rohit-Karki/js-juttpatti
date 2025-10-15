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
import {
  pickCardAsync,
  dropCardAsync,
  startGameAsync,
} from "../gamelogic/redux/slices/cardSlice";
import { initGame } from "../gamelogic/redux/slices/cardSlice";
import PlayerCardGroup from "../components/cards/PlayerCardGroup";

const { width, height } = Dimensions.get("window");

export default function JSGame() {
  const dispatch = useDispatch();
  const [isConnected, setIsConnected] = useState(true);
  const [transport, setTransport] = useState("N/A");

  const onConnect = () => {
    console.log("Connected to server");
    setIsConnected(true);
    setTransport(socket.io.engine.transport.name);
  };

  const onDisconnect = () => {
    console.log("Disconnected from server");
    setIsConnected(false);
  };

  const state = useSelector((state) => state.game);
  const userState = useSelector((state) => state.user);

  const handlePickCard = (card) => {
    // const card = gametate.deck[0]; // Get first card from deck
    if (card) {
      dispatch(
        pickCardAsync({
          playerId: userState.userId,
          card: card,
          roomId: state.roomId,
        })
      );
    }
  };

  const handleDropCard = (card) => {
    // Example: Drop a card from player's hand
    const player = state.players.find((p) => p.userId === userState.userId);
    if (player && player.cards.length > 0) {
      // const card = player.cards[0]; // Get first card from hand
      dispatch(
        dropCardAsync({
          playerId: userState.userId,
          card: card,
          roomId: state.roomId,
        })
      );
    }
  };

  const handleStartGame = () => {
    dispatch(startGameAsync(state.roomId));
  };

  // Handler for when a card is thrown
  const handleCardThrown = (cardData) => {
    console.log("Card thrown:", cardData);

    // Here you would call your backend
    // socket.emit("pick_card", {
    //   playerId: userState.userId,
    //   pickedCard: {
    //     type: cardData.type,
    //     value: cardData.value,
    //     color: cardData.color,
    //   },
    // });
    handleDropCard(cardData);

    // For now, just log it
    console.log(`Card thrown: ${cardData.type} ${cardData.value}`);
  };

  console.log("state is ", state);
  console.log("userState is ", userState);

  useEffect(() => {
    if (!socket.connected) {
      console.log("Connect");
      socket.connect();
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    console.log("socket active or not ", socket.active);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  // Get current player
  const currentPlayer = state.players?.find(
    (p) => p.userId === userState.userId
  );

  // Get other players (opponents)
  const opponents =
    state.players?.filter((p) => p.userId !== userState.userId) || [];

  console.log("currentPlayer is ", currentPlayer);
  console.log("currentPlayer cards:", currentPlayer?.cards);
  console.log("state.players:", state.players);

  return (
    <View style={styles.container}>
      {/* Background Board */}
      <Image
        source={require("../../assets/sprites/Board.png")}
        style={styles.boardImage}
      />

      {/* Status Display */}
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>
          Status: {isConnected ? "connected" : "disconnected"}
        </Text>
        <Text style={styles.statusText}>Transport: {transport}</Text>
      </View>

      {/* Opponent Players - Top Area */}
      <View style={styles.opponentsContainer}>
        {opponents.map((player, index) => (
          <View key={player.userId} style={styles.opponentSection}>
            <Text style={styles.playerName}>{player.userName}</Text>
            <View style={styles.opponentCardsRow}>
              {player.cards.map((card, cardIndex) => (
                <View key={cardIndex} style={styles.cardBackWrapper}>
                  <View style={styles.cardBack}>
                    <Text style={styles.cardBackText}>🂠</Text>
                  </View>
                </View>
              ))}
            </View>
            <Text style={styles.scoreText}>Score: {player.score}</Text>
          </View>
        ))}
      </View>

      {/* Table Cards - Center Area */}
      <View style={styles.tableCenterContainer}>
        {state.tableCards && state.tableCards.length > 0 ? (
          <View style={styles.tableCardsRow}>
            {state.tableCards.map((card, index) => (
              <Card
                key={index}
                imageSrc={ImagesAssets[`${card.type}_${card.value}_white`]}
              />
            ))}
          </View>
        ) : (
          <View style={styles.emptyTableCard}>
            <Text style={styles.emptyTableText}>Table Empty</Text>
          </View>
        )}
      </View>

      {/* Current Player's Cards - Bottom Area */}
      {currentPlayer &&
      currentPlayer.cards &&
      currentPlayer.cards.length > 0 ? (
        <View style={styles.playerCardsContainer}>
          <View style={styles.playerInfo}>
            <Text style={styles.currentPlayerName}>
              {currentPlayer.userName}
            </Text>
            <Text style={styles.currentPlayerScore}>
              Score: {currentPlayer.score}
            </Text>
            {currentPlayer.isTurn && (
              <Text style={styles.turnIndicator}>YOUR TURN</Text>
            )}
          </View>
          <View style={styles.cards}>
            {currentPlayer.cards.map((card, index) => (
              <Card
                key={index}
                imageSrc={ImagesAssets[`${card.type}_${card.value}_white`]}
                cardData={card}
                onCardThrown={handleCardThrown}
              />
            ))}
          </View>
        </View>
      ) : (
        <View style={styles.playerCardsContainer}>
          <Text style={styles.debugText}>
            No cards found. User ID: {userState.userId}
          </Text>
          <Text style={styles.debugText}>
            Players: {state.players?.length || 0}
          </Text>
        </View>
      )}

      {/* Game Info Display */}
      <View style={styles.gameInfoContainer}>
        <Text style={styles.gameInfoText}>Game Status: {state.gameStatus}</Text>
        {state.winner && (
          <Text style={styles.winnerText}>Winner: {state.winner}</Text>
        )}
      </View>

      <StatusBar hidden />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2d5016",
    alignItems: "center",
    justifyContent: "center",
  },
  boardImage: {
    position: "absolute",
    width: 800,
    height: 400,
    resizeMode: "contain",
  },
  statusContainer: {
    position: "absolute",
    top: 20,
    left: 20,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    padding: 10,
    borderRadius: 8,
    zIndex: 100,
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
  },
  opponentsContainer: {
    position: "absolute",
    top: 60,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 20,
    zIndex: 50,
  },
  opponentSection: {
    alignItems: "center",
    minWidth: 120,
  },
  playerName: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  opponentCardsRow: {
    flexDirection: "row",
    marginLeft: -15,
  },
  cardBackWrapper: {
    marginLeft: -15,
  },
  cardBack: {
    width: 50,
    height: 70,
    backgroundColor: "#c41e3a",
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  cardBackText: {
    fontSize: 32,
    color: "#fff",
  },
  scoreText: {
    color: "#ffd700",
    fontSize: 12,
    fontWeight: "600",
    marginTop: 5,
  },
  tableCenterContainer: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -100 }, { translateY: -50 }],
    zIndex: 40,
  },
  tableCardsRow: {
    flexDirection: "row",
    gap: 10,
  },
  emptyTableCard: {
    width: 120,
    height: 160,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
  },
  emptyTableText: {
    color: "rgba(255, 255, 255, 0.5)",
    fontSize: 14,
    fontWeight: "600",
  },
  playerCardsContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    alignItems: "center",
    paddingBottom: 20,
  },
  playerInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 15,
    marginBottom: 10,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  currentPlayerName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  currentPlayerScore: {
    color: "#ffd700",
    fontSize: 14,
    fontWeight: "600",
  },
  turnIndicator: {
    color: "#00ff00",
    fontSize: 14,
    fontWeight: "bold",
    paddingHorizontal: 10,
    paddingVertical: 3,
    backgroundColor: "rgba(0, 255, 0, 0.2)",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#00ff00",
  },
  cards: {
    width: height,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  gameInfoContainer: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    padding: 10,
    borderRadius: 8,
    zIndex: 100,
  },
  gameInfoText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  winnerText: {
    color: "#ffd700",
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 5,
  },
  debugText: {
    color: "#fff",
    fontSize: 14,
    marginVertical: 5,
    textAlign: "center",
  },
});
