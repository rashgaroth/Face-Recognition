import { useAppSelector } from '@hook/useReducers'
import { Avatar, Container, CssBaseline, Stack } from '@mui/material'
import { ThemeProvider } from '@mui/system'
import Join from '@pages/join'
import React from 'react'
import { createBrowserRouter } from 'react-router-dom'
import nvpLogo from '@asset/img/nvp_logo.png'
import Home from './pages/home'
import Meet from './pages/meet'
import theme from './themes'
import Navbar from '@component/Navbar'
import ToggleTheme from '@component/ToggleTheme'
import { desktopDisplay } from '@shared/display'
import Room from '@pages/room'

const NavbarWrapper = ({ el }: { el: React.ReactNode }) => {
  const themeState = useAppSelector((state) => state.theme)

  return (
    <ThemeProvider theme={theme({ mode: themeState.mode })}>
      <CssBaseline />
      <Container maxWidth="xl">
        <div className="grid place-items-center">
          <Stack
            direction={'row'}
            justifyContent="space-between"
            width="100%"
            mt={4}
            alignItems={'center'}
            justifyItems="center"
            alignContent={'center'}>
            <Avatar src={nvpLogo} sx={{ width: 60, height: 60, display: desktopDisplay }} />
            <Navbar />
            <ToggleTheme />
          </Stack>
        </div>
        {el}
      </Container>
    </ThemeProvider>
  )
}

const ThemeWrapper = ({ el }: { el: React.ReactNode }) => {
  const themeState = useAppSelector((state) => state.theme)

  return (
    <ThemeProvider theme={theme({ mode: themeState.mode })}>
      <CssBaseline />
      {el}
    </ThemeProvider>
  )
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <NavbarWrapper el={<Home />} />
  },
  {
    path: '/meet',
    element: <NavbarWrapper el={<Meet />} />
  },
  {
    path: '/join',
    element: <NavbarWrapper el={<Join />} />
  },
  {
    path: '/room/:roomId',
    element: <ThemeWrapper el={<Room />} />
  }
])
