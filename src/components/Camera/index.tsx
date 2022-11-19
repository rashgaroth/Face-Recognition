import { useCardRatio } from '@hook/useCardRatio'
import { useOffsets } from '@hook/useOffset'
import { useUserMedia } from '@hook/useUserMedia'
import { Mic, VideocamOutlined } from '@mui/icons-material'
import { Box, CircularProgress, Stack } from '@mui/material'
import { useRef, useState } from 'react'
import Measure, { ContentRect } from 'react-measure'

const CAPTURE_OPTIONS = {
  audio: false,
  video: { facingMode: 'environment' }
}

const Camera = () => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)

  const mediaStream = useUserMedia(CAPTURE_OPTIONS)

  if (mediaStream && videoRef.current && !videoRef.current.srcObject) {
    videoRef.current.srcObject = mediaStream
  }

  const handleCanPlay = () => {
    console.log('onPlay')
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    setIsVideoPlaying(true)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    videoRef.current.play()
  }

  if (!mediaStream) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height={'100%'}>
        <Stack direction={'row'} spacing={2}>
          <p className="text-black">Loading ... </p>
          <CircularProgress size={20} />
        </Stack>
      </Box>
    )
  }

  return (
    <Measure bounds>
      {({ measureRef }) => (
        <div className="flex flex-col items-center w-full transition-width transition-slowest ease-in-out delay-150">
          <div className="relative w-full transition-width ease-in-out delay-150" ref={measureRef}>
            <video
              ref={videoRef}
              hidden={!isVideoPlaying}
              onCanPlay={handleCanPlay}
              className="w-full h-96 rounded-xl transition-width transition-slowest ease-in-out delay-150"
              muted
              playsInline
              autoPlay
            />
          </div>
        </div>
      )}
    </Measure>
  )
}

export default Camera
