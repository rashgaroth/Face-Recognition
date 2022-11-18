/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Container from '@mui/material/Container'
import Button from '@mui/material/Button'
import { Stack } from '@mui/material'
import { Home, JoinFull, VideoCall } from '@mui/icons-material'

const Navbar = () => {
  return (
    <AppBar position="static" sx={{ borderRadius: 8, maxWidth: 400, bgcolor: 'secondary.light', position: 'relative' }}>
      <Container maxWidth="xs">
        <Toolbar disableGutters>
          <Stack direction={'row'} alignItems="center" justifyContent={'space-between'} justifyItems="center" sx={{ width: '100%' }}>
            <Button
              sx={{
                my: 1,
                color: 'white',
                borderRadius: 8,
                bgcolor: 'secondary.light',
                '&:hover': {
                  bgcolor: 'secondary.main'
                }
              }}>
              <Stack direction="row" spacing={1}>
                <Home />
                <p className="font-bold text-gray-50">Home</p>
              </Stack>
            </Button>
            <Button
              sx={{
                my: 1,
                color: 'white',
                borderRadius: 8,
                bgcolor: 'secondary.light',
                '&:hover': {
                  bgcolor: 'secondary.main'
                }
              }}>
              <Stack direction="row" spacing={1}>
                <VideoCall />
                <p className="font-bold text-gray-50">Meet</p>
              </Stack>
            </Button>
            <Button
              sx={{
                my: 1,
                color: 'white',
                borderRadius: 8,
                bgcolor: 'secondary.light',
                '&:hover': {
                  bgcolor: 'secondary.main'
                }
              }}>
              <Stack direction="row" spacing={1}>
                <JoinFull />
                <p className="font-bold text-gray-50">Join</p>
              </Stack>
            </Button>
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  )
}
export default Navbar
