import homeReducer from '@reducer/homeReducer'
import themeReducer from '@reducer/themeReducer'
import { configureStore } from '@reduxjs/toolkit'

const store = configureStore({
  reducer: {
    home: homeReducer,
    theme: themeReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
