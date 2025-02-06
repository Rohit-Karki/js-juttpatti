import { configureStore } from "@reduxjs/toolkit";
import socketReducer from "./slices/socketSlice";
import gameReducer from "./slices/cardSlice";
import userReducer from "./slices/userSlice";
import socketMiddleware from "./middleware/socketMiddleware";

export const store = configureStore({
  reducer: {
    socket: socketReducer,
    game: gameReducer,
    user: userReducer,
  },
  // middleware(getDefaultMiddleware) {
  //   return getDefaultMiddleware().concat([socketMiddleware]);
  // },
});
