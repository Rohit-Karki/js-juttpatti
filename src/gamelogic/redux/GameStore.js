import { configureStore } from "@reduxjs/toolkit";
import socketReducer from "./slices/socketSlice";
import gameReducer from "./slices/cardSlice";
import socketMiddleware from "./middleware/socketMiddleware";

export const store = configureStore({
  reducer: { socketReducer, gameReducer },
  middleware(getDefaultMiddleware) {
    return getDefaultMiddleware().concat([socketMiddleware]);
  },
});
