import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: [],
};

export const cardSlice = createSlice({
  name: "cards",
  initialState,
  reducers: {
    addCard: (state, action) => {
      switch (action.value) {
        case 1:
          state.value = [...state.value, 1];
        case 2:
          state.value = [...state.value, 2];
      }
    },
    removeCard: (state) => {
      state.value -= 1;
    },
  },
});

// Action creators are generated for each case reducer function
export const { addCard, removeCard } = cardSlice.actions;

export default cardSlice.reducer;
