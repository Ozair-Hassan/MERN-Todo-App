import { configureStore } from '@reduxjs/toolkit'
import authSlice from './redux/authSlice'
import itemSlice from './redux/itemSlice'

export const store = configureStore({
  reducer: {
    auth: authSlice,
    item: itemSlice,
  },
})
