import express from "express";
import { createServer } from "http";
import cors from "cors";
import { Server } from "socket.io";
import { GameEngine } from "./GameEngine.js";

function nextTurn() {
  // Determine the next player based on game rules
  io.emit("gameState", gameState);
}

// export default {
//     startServer: function (store) {
//         console.log("Let the Game begin");

//         const io = new Server().attach(8090);

//         store.subscribe(
//             () => io.emit('state-change', store.getState().toJS())
//         );

//         io.on('connection', (socket) => {
//             console.log('New Connection');

//             socket.emit('state-change', store.getState().toJS());
//             socket.on('action', store.dispatch.bind(store));
//         });
//     }
// }

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:8081"],
  },
});

// Store active rooms and their players
const rooms = new Map();

app.use(cors());
app.use(express.json());

// REST API endpoint to create/join a room
app.post("/api/rooms/create", (req, res) => {
  console.log("create room", req.body);
  const { userId, userName } = req.body;

  if (!userId || !userName) {
    return res.status(400).json({ error: "userId and userName are required" });
  }

  // Find an available room or create a new one
  let availableRoom = null;

  if (!availableRoom) {
    // First the client only asks to create a room so no need to add the player to the room as well as gameEngine
    const players = [];

    availableRoom = `room_${Date.now()}`;
    rooms.set(availableRoom, {
      gameEngine: null,
      players,
      status: "waiting",
    });

  }

  // Return the room information to the client
  res.json({
    roomId: availableRoom,
    status: "success",
  });
});

io.on("connection", (socket) => {
  console.log(`connect: ${socket.id}`, socket.request.headers);
  // const data = get_init_game_state();

  socket.on("disconnect", () => {
    console.log(`disconnect: ${socket.id}`);
  });

  socket.on("gameAction", (action) => {
    console.log("Received game action:", action);
    
    const { roomId } = action.payload;
    const room = rooms.get(roomId);

    if (room && room.gameEngine) {
      // Dispatch the action to the game engine
      room.gameEngine.dispatch(action);
    } else {
      socket.emit("error", { message: "Game not found or not started" });
    }
  });

  // Keep the old pick_card handler for backward compatibility
  socket.on("pick_card", (action) => {
    console.log(action);
    
    const { roomId, userId } = action;
    const room = rooms.get(roomId);

    if (room && room.gameEngine) {
      // Add the user ID to the action for validation in the GameEngine
      action.payload.userId = userId;
      // Dispatch the action to the game engine
      room.gameEngine.dispatch(action);
    } else {
      socket.emit("error", { message: "Game not found or not started" });
    }
  });

  /*
    Just for testing
  */
  socket.on("hello", (arg) => {
    console.log(arg); // world
  });

  /*
  The host or starter creates a room and gets the initial state 
  args are initial_state and room_id

  * @param room_id - room id
  * @param initial_state - inital state
  * @returns unit
  */

  // In place of client making a room server responds with the room info and client joins that room
  // socket.on("create_room", (room_id, initial_state) => {});

  // Handle room joining
  socket.on("join_room", ({ roomId, userId, userName }) => {
    console.log(roomId);
    const room = rooms.get(roomId);

    if (!room) {
      socket.emit("error", { message: "Room not found" });
      return;
    }

    if (!room.players.find((p) => p.userId === userId)) {
      room.players.push({
        userId,
        userName,
        cards: [],
        score: 0,
        isTurn: false, // First player starts the turn
        socketId: socket.id,
      });
    }

    socket.join(roomId);
    console.log(room);
    // Notify all clients in the room about the new player
    io.to(roomId).emit("player_joined", {
      players: room.players,
      roomId,
    });

    // If room is full (4 players), start the game
    // if (room.players.length === 4) {
    //   room.status = "starting";
    //   io.to(roomId).emit("game_starting", {
    //     players: room.players,
    //     roomId,
    //   });
    // }
  });

  socket.on("game_start", (roomId) => {
    console.log("game starting initial state");
    // broadcast the initial state
    const playersInRoomId = rooms.get(roomId).players;
    const gameEngine = new GameEngine(playersInRoomId, playersInRoomId.length, io, roomId);
    const room = rooms.get(roomId);
    room.gameEngine = gameEngine;
    console.log(gameEngine.getState());
    io.to(roomId).emit("initial_state", {
      initialState: gameEngine.getState(),
    });
  });
});

httpServer.listen(3000, () => {
  console.log("started");
});

// app.listen(API_PORT, () => {
//   logger.info(`Api listening on port ${Number(API_PORT)}!`);
// });

// server.listen(Number(API_PORT) + 1, () => {
//   logger.info(`Socker listening on port ${Number(API_PORT) + 1}!`);
//   logger.info(`Api and socker whitelisted for ${host}`);
// });
