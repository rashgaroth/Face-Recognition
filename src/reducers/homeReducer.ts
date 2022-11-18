import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from 'store'

export interface IHomeState {
  isUserRegistered: boolean
}

const defaultHomeState: IHomeState = {
  isUserRegistered: false
}

export const homeSlicer = createSlice({
  name: 'home',
  initialState: defaultHomeState,
  reducers: {
    setUser: (state, action: PayloadAction<boolean>) => {
      state.isUserRegistered = action.payload
    }
  }
})

export const { setUser } = homeSlicer.actions

export const homeState = (state: RootState) => state.home

export default homeSlicer.reducer
