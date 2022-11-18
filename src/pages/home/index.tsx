import React from 'react'
import Navbar from '@component/Navbar'
import { Avatar, Stack } from '@mui/material'
import Talk from '@asset/svg/talk'
import ToggleTheme from '@component/ToggleTheme'
import nvpLogo from '@asset/img/nvp_logo.png'

const Home = () => {
  return (
    <div className="h-screen">
      <div className="grid place-items-center">
        <Stack
          direction={'row'}
          justifyContent="space-between"
          width="100%"
          mt={4}
          alignItems={'center'}
          justifyItems="center"
          alignContent={'center'}>
          <Avatar src={nvpLogo} sx={{ width: 60, height: 60 }} />
          <Navbar />
          <ToggleTheme />
        </Stack>
      </div>
      <p className="text-5xl font-extrabold mt-10">Welcome To NvP Meet</p>
      <p className="text-2xl">Meet with other people with your NFTs</p>
      <div className="absolute bottom-0 left-0">
        <Talk className="w-96 h-96" />
      </div>
    </div>
  )
}

export default Home
