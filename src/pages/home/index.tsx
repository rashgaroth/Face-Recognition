import React, { useState } from 'react'
import { Stack } from '@mui/material'
import { Add, JoinFull, Mic, VideoCall, VideocamOff, VideocamOutlined } from '@mui/icons-material'
import NvPButton from '@component/Button'
import ModalWrapper from '@component/ModalWrapper'
import Camera from '@component/Camera'
import { useNavigate } from 'react-router-dom'
import { generateId } from '@helper/string'

const features = [
  {
    name: 'Minimal and thoughtful',
    description:
      'Our laptop sleeve is compact and precisely fits 13" devices. The zipper allows you to access the interior with ease, and the front pouch provides a convenient place for your charger cable.',
    imageSrc: 'https://tailwindui.com/img/ecommerce-images/product-feature-07-detail-01.jpg',
    imageAlt: 'White canvas laptop sleeve with gray felt interior, silver zipper, and tan leather zipper pull.'
  }
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

const Home = () => {
  const navigate = useNavigate()

  const [openVideoModal, setOpenVideoModal] = useState(false)
  const [enableVideo, setEnableVideo] = useState(false)

  const onClickCreateRoom = async () => {
    setOpenVideoModal(true)
  }

  const onClickJoin = async () => {
    setEnableVideo(false)
    setOpenVideoModal(false)
    const roomId = generateId(10)
    navigate(`/room/${roomId}`)
  }

  return (
    <div className="min-h-screen">
      <div>
        <div className="mx-auto max-w-2xl py-10 px-4 sm:px-6 sm:py-10 lg:max-w-7xl lg:px-8">
          <div className="mx-auto text-start">
            <h2 className="text-4xl font-bold tracking-tight text-purple-900 sm:text-6xl">
              Welcome to NvP Meet <VideoCall sx={{ width: 60, height: 60 }} />
            </h2>
            <p className="mt-4 text-gray-500 text-xl">
              As a digital creative, your laptop or tablet is at the center of your work. Keep your device safe with a fabric sleeve that
              matches in quality and looks.
            </p>
          </div>

          <div className="mt-16 space-y-16">
            {features.map((feature, featureIdx) => (
              <div key={feature.name} className="flex flex-col-reverse lg:grid lg:grid-cols-12 lg:items-center lg:gap-x-8">
                <div
                  className={classNames(
                    featureIdx % 2 === 0 ? 'lg:col-start-1' : 'lg:col-start-8 xl:col-start-9',
                    'mt-6 lg:mt-0 lg:row-start-1 lg:col-span-5 xl:col-span-4'
                  )}>
                  <h3 className="text-2xl font-medium text-purple-900">{feature.name}</h3>
                  <p className="mt-2 text-xl text-gray-500">{feature.description}</p>
                  <Stack
                    direction={'row'}
                    alignItems="start"
                    justifyItems={'start'}
                    justifyContent={'start'}
                    alignContent="start"
                    width={'100%'}>
                    <NvPButton title="Create Room" onClick={onClickCreateRoom} endIcon={<Add />} />
                    <NvPButton title="Join Room" onClick={onClickCreateRoom} endIcon={<JoinFull />} />
                  </Stack>
                </div>
                <div
                  className={classNames(
                    featureIdx % 2 === 0 ? 'lg:col-start-6 xl:col-start-5' : 'lg:col-start-1',
                    'flex-auto lg:row-start-1 lg:col-span-7 xl:col-span-8'
                  )}>
                  <div className="aspect-w-5 aspect-h-2 overflow-hidden rounded-xl bg-gray-100">
                    <img src={feature.imageSrc} alt={feature.imageAlt} className="object-cover object-center" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <ModalWrapper open={openVideoModal} handleClose={() => setOpenVideoModal(false)}>
        {/* video and mic */}
        <div
          className={classNames(
            enableVideo ? '' : 'bg-black',
            'w-full h-96 rounded-lg relative transition-width transition ease-in-out delay-150'
          )}>
          {enableVideo ? (
            <Camera />
          ) : (
            <div className="absolute m-auto bottom-1/2 left-0 right-0 grid place-items-center">
              <Stack direction={'row'} spacing={2}>
                <div className="p-2">
                  <p className="text-white">Video is turned off</p>
                </div>
              </Stack>
            </div>
          )}
          <div className="absolute m-auto bottom-5 left-0 right-0 grid place-items-center">
            <Stack direction={'row'} spacing={2}>
              <div
                className="p-2 rounded-full border border-white hover:bg-gray-500 hover:cursor-pointer"
                onClick={() => setEnableVideo(!enableVideo)}>
                {enableVideo ? <VideocamOutlined className="text-white" /> : <VideocamOff className="text-white" />}
              </div>
              <div className="p-2 rounded-full border border-white hover:bg-gray-500 hover:cursor-pointer">
                <Mic className="text-white" />
              </div>
            </Stack>
          </div>
        </div>
        <Stack mt={0} width={'100%'}>
          <NvPButton title="Join" onClick={onClickJoin} />
        </Stack>
      </ModalWrapper>
    </div>
  )
}

export default Home
