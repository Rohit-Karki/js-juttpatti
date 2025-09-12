import { socket } from "../../SocketFactory";

// Actions that should be forwarded to the server
const SERVER_ACTIONS = [
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
];

const socketMiddleware = (store) => (next) => (action) => {
  // First, let the action go through to update local state optimistically
  const result = next(action);

  // Check if this action should be forwarded to the server
  if (SERVER_ACTIONS.includes(action.type) && !action.meta?.fromServer) {
    // Forward the action to the server
    socket.emit("gameAction", {
      type: action.type,
      payload: action.payload,
      roomId: store.getState().game.roomId || store.getState().room?.roomId,
    });
  }

  return result;
};

export default socketMiddleware;
