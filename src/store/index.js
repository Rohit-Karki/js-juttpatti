import { configureStore } from '@reduxjs/toolkit'
import cardReducer from './cardslice'

export const store = configureStore({
  reducer: {cardReducer},
})