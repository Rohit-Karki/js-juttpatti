import { io, Socket } from "socket.io-client";

class SocketConnection {
  socket;
  socketEndpoint = process.env.NEXT_PUBLIC_WEBSOCKET_URL;
  // The constructor will initialize the Socket Connection
  constructor() {
    this.socket = io(this.socketEndpoint);
  }
}

let socketConnection;

// The SocketFactory is responsible for creating and returning a single instance of the SocketConnection class
// Implementing the singleton pattern
class SocketFactory {
  create() {
    if (!socketConnection) {
      socketConnection = new SocketConnection();
    }
    return socketConnection;
  }
}

export default socketConnection;
