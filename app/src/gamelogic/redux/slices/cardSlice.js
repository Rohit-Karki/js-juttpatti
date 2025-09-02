import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { gameState } from "../../JuttpattiGameState";

const initialState = gameState;

// Thunk action creators for client-server synchronization
export const pickCardAsync = createAsyncThunk(
  'card/pickCardAsync',
  async ({ playerId, card, roomId }, { dispatch, getState }) => {
    // Optimistically update local state
    dispatch(pickCard({ playerId, card }));
    
    // The socket middleware will automatically forward this to the server
    return { playerId, card };
  }
);

export const dropCardAsync = createAsyncThunk(
  'card/dropCardAsync',
  async ({ playerId, card, roomId }, { dispatch, getState }) => {
    // Optimistically update local state
    dispatch(dropCard({ playerId, card }));
    
    // The socket middleware will automatically forward this to the server
    return { playerId, card };
  }
);

export const startGameAsync = createAsyncThunk(
  'card/startGameAsync',
  async (roomId, { dispatch, getState }) => {
    // The socket middleware will automatically forward this to the server
    return { roomId };
  }
);

const gameSlice = createSlice({
  name: "card",
  initialState,
  // Reducers: Functions we can call on the store
  reducers: {
    initGame: (state, action) => {
      // Properly merge the new state instead of reassigning
      Object.assign(state, action.payload.initialState);
      console.log("initGame", state);
    },
    pickCard: (state, action) => {
      const { playerId, card } = action.payload;
      const player = state.players.find(p => p.id === playerId);
      if (player) {
        player.cards.push(card);
        state.deck = state.deck.filter((c) => c !== card);
      }
    },
    dropCard: (state, action) => {
      const { playerId, card } = action.payload;
      const player = state.players.find(p => p.id === playerId);
      if (player) {
        player.cards = player.cards.filter(c => c !== card);
        state.tableCards.push(card);
      }
    },
    updateGameState: (state, action) => {
      // This reducer receives the authoritative state from server
      Object.assign(state, action.payload);
    },
    setPlayerTurn: (state, action) => {
      const { playerId } = action.payload;
      state.players.forEach(p => p.isTurn = false);
      const player = state.players.find(p => p.id === playerId);
      if (player) {
        player.isTurn = true;
      }
    },
    // Handle server actions (with meta.fromServer flag)
    serverPickCard: (state, action) => {
      const { playerId, card } = action.payload;
      const player = state.players.find(p => p.id === playerId);
      if (player) {
        player.cards.push(card);
        state.deck = state.deck.filter((c) => c !== card);
      }
    },
    serverDropCard: (state, action) => {
      const { playerId, card } = action.payload;
      const player = state.players.find(p => p.id === playerId);
      if (player) {
        player.cards = player.cards.filter(c => c !== card);
        state.tableCards.push(card);
      }
    }
  },
});

// Don't have to define actions, they are automatically generated
export const { 
  initGame, 
  pickCard, 
  dropCard, 
  updateGameState, 
  setPlayerTurn,
  serverPickCard,
  serverDropCard
} = gameSlice.actions;
// Export the reducer for this slice
export default gameSlice.reducer;
