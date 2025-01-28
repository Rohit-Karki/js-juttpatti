import socketio from "socket.io";

export default (server) => {
  const io = socketio.listen(server, { ...options });

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

  return io;
};
