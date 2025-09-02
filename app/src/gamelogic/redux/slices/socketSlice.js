// Slice of store that manages Socket connections
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  socketId: "",
  isConnected: false,
  joinedRoomId: "",
  joinedInRoomPlayers: [],
  rooms: [],
};

// Now create the slice
const socketSlice = createSlice({
  name: "socket",
  initialState,
  // Reducers: Functions we can call on the store
  reducers: {
    initSocket: (state) => {
      return;
    },
    connectionEstablished: (state) => {
      state.isConnected = true;
    },
    connectionLost: (state) => {
      state.isConnected = false;
    },
    joinRoom: (state, action) => {
      // After the required room is joined through middleware, we manage state here!
      console.log("joined room in slice");
      const room = action.payload.roomId;
      state.joinedRoomId = room;
    },
    pushUserToRoom: (state, action) => {
      const players = action.payload.players;
      state.joinedInRoomPlayers = players;
    },
  },
});

// Don't have to define actions, they are automatically generated
export const {
  initSocket,
  connectionEstablished,
  connectionLost,
  joinRoom,
  pushUserToRoom,
} = socketSlice.actions;
// Export the reducer for this slice
export default socketSlice.reducer;
