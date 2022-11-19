/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useEffect, useState } from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Container from '@mui/material/Container'
import Button from '@mui/material/Button'
import { Stack } from '@mui/material'
import { Home, JoinFull, VideoCall } from '@mui/icons-material'
import { useLocation, useNavigate } from 'react-router-dom'

const Navbar = () => {
  const location = useLocation()
  const navigate = useNavigate()

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [navbarItem, setNavbarItem] = useState([
    {
      id: 1,
      name: 'Home',
      path: '/',
      icon: <Home />,
      active: true
    },
    {
      id: 2,
      name: 'Meet',
      path: '/meet',
      icon: <VideoCall />,
      active: false
    },
    {
      id: 3,
      name: 'Join',
      path: '/join',
      icon: <JoinFull />,
      active: false
    }
  ])

  useEffect(() => {
    for (const i in navbarItem) {
      if (location.pathname === navbarItem[i].path) {
        const filtered = navbarItem.filter((x) => x.path !== location.pathname)
        const selected = navbarItem.filter((x) => x.path === location.pathname)
        filtered.map((x) => (x.active = false))
        selected[0].active = true
        setNavbarItem([...filtered, ...selected].sort((a, b) => a.id - b.id))
      }
    }
  }, [location.pathname])

  return (
    <AppBar position="static" sx={{ borderRadius: 8, maxWidth: 400, bgcolor: 'background.gradient', position: 'relative' }}>
      <Container maxWidth="xs">
        <Toolbar disableGutters>
          <Stack direction={'row'} alignItems="center" justifyContent={'space-between'} justifyItems="center" sx={{ width: '100%' }}>
            {navbarItem.map((x) => (
              <Button
                key={x.name}
                onClick={() => navigate(x.path)}
                sx={{
                  my: 1,
                  color: 'white',
                  borderRadius: 8,
                  bgcolor: x.active ? 'primary.dark' : 'primary.light',
                  '&:hover': {
                    bgcolor: x.active ? 'primary.light' : 'primary.dark'
                  }
                }}>
                <Stack direction="row" spacing={1}>
                  {x.icon}
                  <p className="font-bold text-gray-50">{x.name}</p>
                </Stack>
              </Button>
            ))}
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  )
}
export default Navbar
