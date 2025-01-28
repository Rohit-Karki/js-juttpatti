import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

function gameStart(store) {
  console.log("Let the Game begin");

  const io = new Server().attach(8090);

  store.subscribe(() => io.emit("state-change", store.getState().toJS()));

  io.on("connection", (socket) => {
    console.log("New Connection");

    socket.emit("state-change", store.getState().toJS());
    socket.on("action", store.dispatch.bind(store));
  });
}

function nextTurn() {
  // Determine the next player based on game rules
  // ...
  // io.emit('gameState', gameState);
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

io.on("connection", (socket) => {
  console.log(`connect: ${socket.id}`, socket.request.headers);

  socket.on("disconnect", () => {
    console.log(`disconnect: ${socket.id}`);
  });

  /*
    Just for testing
  */
  socket.on("hello", (arg) => {
    console.log(arg); // world
  });

  socket.on("initial_state", (value) => {
    // console.log(`state: ${value}`);
    console.log("state:", value);
  });

  /*
  The host or starter creates a room and gets the initial state 
  args are initial_state and room_id

  * @param room_id - room id
  * @param initial_state - inital state
  * @returns unit
  */

  socket.on("create_room", (room_id, initial_state) => {});
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
