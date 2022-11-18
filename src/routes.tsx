import { useAppSelector } from '@hook/useReducers'
import { Container, CssBaseline } from '@mui/material'
import { ThemeProvider } from '@mui/system'
import React from 'react'
import { createBrowserRouter } from 'react-router-dom'
import Home from './pages/home'
import Meet from './pages/meet'
import theme from './themes'

const ThemeWrapper = ({ el }: { el: React.ReactNode }) => {
  const themeState = useAppSelector((state) => state.theme)

  return (
    <ThemeProvider theme={theme({ mode: themeState.mode })}>
      <CssBaseline />
      <Container maxWidth="xl">{el}</Container>
    </ThemeProvider>
  )
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <ThemeWrapper el={<Home />} />
  },
  {
    path: '/meet',
    element: <ThemeWrapper el={<Meet />} />
  }
])
