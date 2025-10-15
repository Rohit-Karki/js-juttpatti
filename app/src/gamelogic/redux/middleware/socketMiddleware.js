import { connectToSocket, socket } from "../../../socket";
// Actions that should be forwarded to the server
const SERVER_ACTIONS = [
  "card/dropCardAsync/pending",
  "card/pickCardAsync/pending",
  "card/startGameAsync/pending",
  "PICK_CARD",
  "DROP_CARD",
  "START_GAME",
  "JOIN_ROOM",
  "CREATE_ROOM",
];

// Actions that come from the server (should not be forwarded)
const SERVER_RESPONSE_ACTIONS = [
  "gameAction",
  "gameStateUpdate",
  "initial_state",
  "player_joined",
  "game_starting",
  "card/dropCardAsync/fulfilled",
  "card/pickCardAsync/fulfilled",
  "card/startGameAsync/fulfilled",
  "card/dropCardAsync/rejected",
  "card/pickCardAsync/rejected",
  "card/startGameAsync/rejected",
];

const socketMiddleware = (store) => (next) => (action) => {
  // First, let the action go through to update local state optimistically
  const result = next(action);
  console.log("middleware action:", action);

  // Check socket connection status
  console.log("Socket connected:", socket.connected);
  console.log("Socket instance:", socket);

  // Check for dropCardAsync/pending instead of dropCardAsync
  if (
    action.type === "card/dropCardAsync/pending" &&
    !action.meta?.fromServer
  ) {
    const { playerId, card, roomId } = action.meta.arg;

    console.log("Forwarding DROP_CARD to server:", { playerId, card, roomId });
    try {
      const emitResult = socket.emit("gameAction", {
        type: "DROP_CARD",
        payload: { playerId, card, roomId },
        roomId: roomId || store.getState().game.roomId,
      });
      console.log("Socket emit result:", emitResult);
      console.log("Socket emit completed successfully");
    } catch (error) {
      console.error("Socket emit error:", error);
    }
  }

  // Check for pickCardAsync/pending instead of pickCardAsync
  if (
    action.type === "card/pickCardAsync/pending" &&
    !action.meta?.fromServer
  ) {
    const { playerId, card, roomId } = action.meta.arg;

    console.log("Forwarding PICK_CARD to server:", { playerId, card, roomId });

    socket.emit("gameAction", {
      type: "PICK_CARD",
      payload: { playerId, card },
      roomId: roomId || store.getState().game.roomId,
    });
  }

  // Check for startGameAsync/pending instead of startGameAsync
  if (
    action.type === "card/startGameAsync/pending" &&
    !action.meta?.fromServer
  ) {
    const roomId = action.meta.arg;

    console.log("Forwarding START_GAME to server:", { roomId });

    socket.emit("gameAction", {
      type: "START_GAME",
      payload: {},
      roomId: roomId || store.getState().game.roomId,
    });
  }

  // Check if this action should be forwarded to the server (legacy actions)
  if (SERVER_ACTIONS.includes(action.type) && !action.meta?.fromServer) {
    console.log("Forwarding legacy action to server:", action.type);

    socket.emit("gameAction", {
      type: action.type,
      payload: action.payload,
      roomId: store.getState().game.roomId || store.getState().room?.roomId,
    });
  }

  return result;
};

export default socketMiddleware;
