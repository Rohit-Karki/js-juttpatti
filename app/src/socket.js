import { io } from "socket.io-client";

export const socket = io("http://localhost:3000", {
  autoConnect: true,
  transports: ["websocket"],
}); //	use the IP address of your machine

socket.onAny((event, ...args) => {
  console.log(event, args);
});

socket.on("connect_error", (err) => {
  if (err.message === "invalid username") {
    this.usernameAlreadySelected = false;
  }
});

export const connectToSocket = () => {
  if (!socket.connected) {
    socket.connect();
  }
};
