import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from 'store'

export interface IThemeState {
  mode: 'light' | 'dark'
}

const defaultThemeState: IThemeState = {
  mode: 'light'
}

export const themeSlicer = createSlice({
  name: 'theme',
  initialState: defaultThemeState,
  reducers: {
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.mode = action.payload
    }
  }
})

export const { setTheme } = themeSlicer.actions

export const themeState = (state: RootState) => state.theme

export default themeSlicer.reducer
