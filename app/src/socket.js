import { io } from "socket.io-client";
import { store } from "./gamelogic/redux/GameStore";
import { 
  updateGameState, 
  serverPickCard, 
  serverDropCard, 
  setPlayerTurn 
} from "./gamelogic/redux/slices/cardSlice";

export const socket = io("http://localhost:3000", {
  autoConnect: true,
  transports: ["websocket"],
}); //	use the IP address of your machine

// Handle server game actions
socket.on("gameAction", (action) => {
  console.log("Received game action from server:", action);
  
  // Dispatch server actions with meta flag to prevent infinite loops
  switch (action.type) {
    case "PICK_CARD":
      store.dispatch(serverPickCard(action.payload));
      break;
    case "DROP_CARD":
      store.dispatch(serverDropCard(action.payload));
      break;
    case "NEXT_TURN":
      store.dispatch(setPlayerTurn(action.payload));
      break;
    case "START_GAME":
      store.dispatch(updateGameState(action.payload));
      break;
    default:
      console.log("Unknown server action:", action.type);
  }
});

// Handle game state updates from server
socket.on("gameStateUpdate", (gameState) => {
  console.log("Received game state update from server:", gameState);
  store.dispatch(updateGameState(gameState));
});

// Handle initial game state
socket.on("initial_state", (data) => {
  console.log("Received initial game state:", data);
  store.dispatch(updateGameState(data.initialState));
});

// Handle player joined events
socket.on("player_joined", (data) => {
  console.log("Player joined:", data);
  // You might want to dispatch an action to update the room state
});

// Handle game starting events
socket.on("game_starting", (data) => {
  console.log("Game starting:", data);
  // You might want to dispatch an action to update the game status
});

socket.onAny((event, ...args) => {
  console.log(event, args);
});

socket.on("connect_error", (err) => {
  console.error("Socket connection error:", err);
  if (err.message === "invalid username") {
    this.usernameAlreadySelected = false;
  }
});

export const connectToSocket = () => {
  if (!socket.connected) {
    socket.connect();
  }
};
