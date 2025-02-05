import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userId: "rohit" + Math.random().toString(36).substr(2, 9),
  userName: "Player " + Math.floor(Math.random() * 1000),
};

const userSlice = createSlice({
  name: "User",
  initialState,
  // Reducers: Functions we can call on the store
  reducers: {
    changeUser: (state, action) => {
      state = action.payload;
    },
  },
});

// Don't have to define actions, they are automatically generated
export const { changeUser } = userSlice.actions;
// Export the reducer for this slice
export default userSlice.reducer;
