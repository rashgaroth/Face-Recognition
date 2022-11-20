import RightDrawer from '@component/RightDrawer'
import WebcamWrapper from '@component/WebcamWrapper'
import { classNames } from '@helper/ui'
import { CallEnd, Cameraswitch, Mic, MicOff, ResetTv, Settings, VideocamOff, VideocamOutlined } from '@mui/icons-material'
import { Fab, Stack } from '@mui/material'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { animated, config, useSpring } from 'react-spring'

const Room = () => {
  const [isMultiple, setIsMultiple] = useState(false)
  const [initialSize, setInitialSize] = useState(100)
  const [enableVideo, setEnableVideo] = useState(true)
  const [enableMic, setEnableMic] = useState(true)
  const [openDrawer, setOpenDrawer] = useState(false)
  const navigate = useNavigate()
  const frameSpringStyleProps = useSpring({
    width: `${initialSize}%`,
    height: `${initialSize}%`,
    borderRadius: 8,
    border: `5px solid white`,
    config: config.molasses
  })

  const onLeaveRoom = () => {
    navigate('/')
  }

  const onResize = () => {
    setInitialSize(initialSize === 100 ? 25 : 100)
  }

  return (
    <div className="h-screen w-full relative">
      <div className={classNames('relative w-full h-full bg-white', isMultiple ? 'grid grid-cols-2 gap-0' : '')}>
        <animated.div className="relative rounded-xl" style={frameSpringStyleProps}>
          <WebcamWrapper />
        </animated.div>
        {/* <animated.div className="relative rounded-xl" style={frameSpringStyleProps}>
          <WebcamWrapper />
        </animated.div>
        <animated.div className="relative rounded-xl" style={frameSpringStyleProps}>
          <WebcamWrapper />
        </animated.div>
        <animated.div className="relative rounded-xl" style={frameSpringStyleProps}>
          <WebcamWrapper />
        </animated.div> */}
      </div>
      <RightDrawer handleClose={() => setOpenDrawer(false)} open={openDrawer} />
      <div className="absolute bottom-5 right-5 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300">
        <Fab
          color="primary"
          className="bg-white"
          sx={{ bgcolor: 'white', '&:hover': { bgcolor: 'background.paper' } }}
          onClick={() => setOpenDrawer(true)}>
          <Settings className="text-gray-700" />
        </Fab>
      </div>
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <div className="absolute m-auto bottom-0 left-0 right-0 grid place-items-center bg-white w-min px-10 py-5 rounded-t-xl">
          <Stack direction={'row'} spacing={2}>
            <div
              className={classNames(
                'p-2 rounded-full hover:cursor-pointer',
                enableVideo ? 'bg-blue-300 hover:bg-blue-200' : 'bg-red-300 hover:bg-red-200'
              )}
              onClick={() => setEnableVideo(!enableVideo)}>
              {enableVideo ? <VideocamOutlined className="text-blue-700" /> : <VideocamOff className="text-red-700" />}
            </div>
            <div className="p-2 rounded-full border bg-red-700 hover:bg-red-600 hover:cursor-pointer" onClick={onLeaveRoom}>
              <CallEnd className="text-red-300" />
            </div>
            <div
              className={classNames(
                'p-2 rounded-full hover:cursor-pointer',
                enableMic ? 'bg-green-300 hover:bg-green-200' : 'bg-red-300 hover:bg-red-200'
              )}
              onClick={() => setEnableMic(!enableMic)}>
              {enableMic ? <Mic className="text-green-700" /> : <MicOff className="text-red-700" />}
            </div>
            <div className={classNames('p-2 rounded-full hover:cursor-pointer')} onClick={onResize}>
              <Cameraswitch className="text-green-700" />
            </div>
          </Stack>
        </div>
      </div>
    </div>
  )
}

export default Room
