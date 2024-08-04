import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: null,
  currentItemId: null,
  viewedItems: null,
  singleItem: null,
  markedDone: null,
  markedIncomplete: null,
  error: null,
}

export const itemSlice = createSlice({
  name: 'item',
  initialState,
  reducers: {
    setItems: (state, action) => {
      state.items = action.payload.items
    },
    setMarkedDone: (state, action) => {
      state.markedDone = action.payload.itemCount
    },
    setMarkedIncomplete: (state, action) => {
      state.markedIncomplete = action.payload.itemCount
    },
    setViewedItems: (state, action) => {
      const startIndex = 0
      const endIndex = startIndex + action.payload.perPage
      // console.log('startIndex: ' + startIndex)
      // console.log('endIndex: ' + endIndex)
      if (state.items) {
        state.viewedItems = state.items.slice(startIndex, endIndex)
      }
    },
    setSingleItem: (state, action) => {
      state.singleItem = action.payload.item
    },
    setCurrentItemId: (state, action) => {
      state.currentItemId = action.payload
    },
    setCurrentIdClear: (state) => {
      state.currentItemId = null
    },
    setItemClear: (state) => {
      state.items = null
      state.currentItemId = null
      state.singleItem = null
      state.viewedItems = null
      state.markedDone = null
      state.markedIncomplete = null
    },
  },
})

export const {
  setItems,
  setCurrentItemId,
  setItemClear,
  setSingleItem,
  setCurrentIdClear,
  setViewedItems,
  setMarkedDone,
  setMarkedIncomplete,
} = itemSlice.actions

export default itemSlice.reducer
