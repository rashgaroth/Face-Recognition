/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Container from '@mui/material/Container'
import Button from '@mui/material/Button'
import { Stack } from '@mui/material'
import { desktopDisplay } from '@shared/display'
import { DarkMode, LightMode } from '@mui/icons-material'
import { useAppSelector } from '@hook/useReducers'

const ToggleTheme = () => {
  const { mode } = useAppSelector((state) => state.theme)

  return (
    <AppBar
      position="static"
      sx={{ borderRadius: 8, maxWidth: 230, bgcolor: 'primary.main', position: 'relative', display: desktopDisplay }}>
      <Container maxWidth="xs">
        <Toolbar disableGutters>
          <Stack direction={'row'} alignItems="center" justifyContent={'space-between'} justifyItems="center" sx={{ width: '100%' }}>
            <Button
              sx={{
                my: 1,
                color: 'white',
                borderRadius: 8,
                bgcolor: mode === 'light' ? 'primary.light' : 'primary.main',
                '&:hover': {
                  bgcolor: mode === 'light' ? 'primary.dark' : 'primary.dark'
                }
              }}>
              <Stack direction="row" spacing={1}>
                <LightMode />
                <p className="font-bold text-gray-50">Light</p>
              </Stack>
            </Button>
            <Button
              sx={{
                my: 1,
                color: 'white',
                borderRadius: 8,
                bgcolor: mode === 'dark' ? 'primary.light' : 'primary.main',
                '&:hover': {
                  bgcolor: mode === 'dark' ? 'primary.dark' : 'primary.dark'
                }
              }}>
              <Stack direction="row" spacing={1}>
                <DarkMode />
                <p className="font-bold text-gray-50">Dark</p>
              </Stack>
            </Button>
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  )
}
export default ToggleTheme
