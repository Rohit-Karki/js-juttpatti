import { Middleware } from "redux";
// Actions
import {
  connectionEstablished,
  joinRoom,
  leaveRoom,
  initSocket,
  connectionLost,
} from "../slices/socketSlice";

import { initGame, pickCard, dropCard } from "../slices/cardSlice";
// Socket Factory
import SocketFactory from "../../SocketFactory";

const SocketEvent = {
  Connect: "connect",
  Disconnect: "disconnect",
  // Emit events
  JoinRoom: "join-room",
  LeaveRoom: "leave-room",
  // On events
  Error: "err",

  InitGame: "init-game",
  PickCard: "pick-card",
  DropCard: "drop-card",
};

const socketMiddleware = (store) => {
  let socket;

  return (next) => (action) => {
    // Middleware logic for the `initSocket` action
    if (initSocket.match(action)) {
      if (!socket && typeof window !== "undefined") {
        // Client-side-only code
        // Create/ Get Socket Socket
        socket = SocketFactory.create();

        socket.socket.on(SocketEvent.Connect, () => {
          store.dispatch(connectionEstablished());
        });

        // handle all Error events
        socket.socket.on(SocketEvent.Error, (message) => {
          console.error(message);
        });

        // Handle disconnect event
        socket.socket.on(SocketEvent.Disconnect, (reason) => {
          store.dispatch(connectionLost());
        });

        // Handle pickCard event
        socket.socket.on(SocketEvent.Disconnect, (reason) => {
          store.dispatch(connectionLost());
        });
      }
    }

    // handle the joinRoom action
    if (joinRoom.match(action) && socket) {
      let room = action.payload.room;
      // Join room
      socket.socket.emit(SocketEvent.JoinRoom, room);
      // Then Pass on to the next middleware to handle state
      // ...
    }

    // handle leaveRoom action
    if (leaveRoom.match(action) && socket) {
      let room = action.payload.room;
      socket.socket.emit(SocketEvent.LeaveRoom, room);
      // Then Pass on to the next middleware to handle state
      // ...
    }

    // Handle the pick Card to the server
    if (initGame.match(action) && socket) {
      // let room = action.payload.room;
      let gameState = action.payload.gameState;
      socket.socket.emit(SocketEvent.PickCard, gameState);
    }

    // Handle the pick Card to the server
    if (pickCard.match(action) && socket) {
      // let room = action.payload.room;
      let gameState = action.payload.pickedCardState;
      socket.socket.emit(SocketEvent.PickCard, room, gameState);
    }

    // Handle the drop Card to the server
    if (dropCard.match(action) && socket) {
      let room = action.payload.room;
      let droppedCardState = action.payload.droppedCardState;
      socket.socket.emit(SocketEvent.PickCard, room, droppedCardState);
    }

    next(action);
  };
};

export default socketMiddleware;
