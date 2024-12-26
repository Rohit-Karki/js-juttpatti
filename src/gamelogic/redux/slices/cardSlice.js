import { createSlice } from "@reduxjs/toolkit";
import { gameState } from "../../JuttpattiGameState";

const initialState = gameState;

const gameSlice = createSlice({
  name: "game",
  initialState,
  // Reducers: Functions we can call on the store
  reducers: {
    initGame: (state) => {
      

      return;
    },
    pickCard: (state) => {
      const { playerId, card } = action.payload;
      if (player) {
        player.cards.push(card);
        state.deck = state.deck.filter((c) => c !== card);
      }
    },
    dropCard: (state) => {},
  },
});

// Don't have to define actions, they are automatically generated
export const { initGame, pickCard, dropCard } = gameSlice.actions;
// Export the reducer for this slice
export default gameSlice.reducer;