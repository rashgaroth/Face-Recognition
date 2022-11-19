/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import '@tensorflow/tfjs-backend-webgl'
import { FaceMesh, Results } from '@mediapipe/face_mesh'
import '@tensorflow/tfjs-core'
import '@tensorflow-models/face-detection'

import { Backdrop, CircularProgress, Stack } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import Webcam from 'react-webcam'
import { drawResults } from '@shared/tsfjs/util'
import Stats from 'stats-js'
import * as facemesh from '@tensorflow-models/face-landmarks-detection'
import * as tfjsWasm from '@tensorflow/tfjs-backend-wasm'
import { Camera } from '@mediapipe/camera_utils'
import { drawFace, drawPose } from '@helper/ui'
import { Pose } from '@mediapipe/pose'
import { animateVRM, appendThree, drawCanvas, getScene, loadVRM } from '@helper/three'
import { Holistic, Results as HolisticsResults } from '@mediapipe/holistic'
import { VRM } from '@pixiv/three-vrm'
import { config, useSpring, animated } from 'react-spring'
import ThreeCanvas from '@component/ThreeCanvas'
import { vrmFile } from 'config'

tfjsWasm.setWasmPaths(`https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm@${tfjsWasm.version_wasm}/dist/`)

let startInferenceTime,
  numInferences = 0
let inferenceTimeSum = 0,
  lastPanelUpdate = 0

const WebcamWrapper = () => {
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState(null)
  const [vrmLoaded, setVrmLoaded] = useState(false)
  const [vrm, setVrm] = useState<VRM | null>(null)
  const [initialVrmDivSize, setInitialVrmDivSize] = useState(25)

  const webcamRef = useRef<Webcam>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const divVrmRef = useRef<HTMLDivElement>(null)

  const frameSpringStyleProps = useSpring({
    width: `${initialVrmDivSize}%`,
    height: `${initialVrmDivSize}%`,
    position: 'absolute',
    bottom: 10,
    left: 10,
    backgroundColor: 'white',
    borderRadius: 8,
    border: `5px solid white`,
    config: config.molasses
  })

  function beginEstimateFaceStats() {
    startInferenceTime = (performance || Date).now()
  }

  function endEstimateFaceStats() {
    const endInferenceTime = (performance || Date).now()
    inferenceTimeSum += endInferenceTime - startInferenceTime
    ++numInferences

    const panelUpdateMilliseconds = 1000
    if (endInferenceTime - lastPanelUpdate >= panelUpdateMilliseconds) {
      const averageInferenceTime = inferenceTimeSum / numInferences
      inferenceTimeSum = 0
      numInferences = 0
      stats.customFpsPanel.update(1000.0 / averageInferenceTime, 120 /* maxValue */)
      lastPanelUpdate = endInferenceTime
    }
  }

  const setupStats = () => {
    const stats = new Stats(0)
    stats.customFpsPanel = stats.addPanel(new Stats.Panel('FPS', '#0ff', '#002'))
    stats.showPanel(stats.domElement.children.length - 1)

    const statsPanes = statsRef.current.querySelectorAll('canvas')
    for (let i = 0; i < statsPanes.length; ++i) {
      statsPanes[i].style.width = '140px'
      statsPanes[i].style.height = '80px'
    }
    statsRef.current.appendChild(stats.domElement)
    setStats(stats)
  }

  const setupFacemesh = async () => {
    try {
      const fm = new FaceMesh({
        locateFile(file) {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
        }
      })

      fm.setOptions({
        maxNumFaces: 3,
        refineLandmarks: true, // maybe this will stop the abort errors
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
        selfieMode: true
      })

      // await fm.initialize()
      fm.onResults((res) => drawFace(res, canvasRef))

      const camera = new Camera(webcamRef.current.video, {
        onFrame: async () => {
          await fm.send({ image: webcamRef.current.video })
        },
        facingMode: 'environment',
        width: 1280,
        height: 720
      })

      await camera.start()
    } catch (error) {
      console.error(error, '@errorRunFacemesgUsingCamera')
    }
  }

  const setupPose = async () => {
    const pose = new Pose({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`
    })
    pose.setOptions({
      enableSegmentation: true,
      smoothLandmarks: true,
      smoothSegmentation: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
      modelComplexity: 1,
      selfieMode: true
    })
    pose.onResults((res) => drawPose(res, canvasRef))

    const camera = new Camera(webcamRef.current.video, {
      onFrame: async () => {
        await pose.send({ image: webcamRef.current.video })
      },
      facingMode: 'environment',
      width: 1280,
      height: 720
    })

    await camera.start()
  }

  const setupHolistic = async () => {
    const holistic = new Holistic({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic@0.5.1635989137/${file}`
      }
    })

    holistic.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.7,
      refineFaceLandmarks: true,
      selfieMode: true
    })

    holistic.onResults(initAndAnimate)

    const camera = new Camera(webcamRef.current.video, {
      onFrame: async () => {
        await holistic.send({ image: webcamRef.current.video })
      },
      width: 640,
      height: 480
    })

    camera.start()
  }

  const setupVRM = () => {
    setLoading(true)
    const scene = getScene()
    loadVRM(scene, (vrm) => {
      setInitialVrmDivSize(25)
      setLoading(false)
      setVrmLoaded(true)
      setVrm(vrm)
    })
  }

  const initAndAnimate = (res: HolisticsResults) => {
    if (vrm) {
      drawCanvas(res, canvasRef.current)
      animateVRM(vrm, res, webcamRef.current.video)
    }
  }

  useEffect(() => {
    if (initialVrmDivSize !== 0) {
      console.log('append from effect')
      // appendThree(vrm, divVrmRef.current)
    }
  }, [initialVrmDivSize])

  useEffect(() => {
    // setupVRM()
  }, [])

  useEffect(() => {
    if (vrmLoaded && vrm !== null) {
      console.log(`Should be setupHolistics`)
      // setupHolistic()
    }
  }, [vrm, vrmLoaded])

  return (
    <div>
      <Webcam
        ref={webcamRef}
        audio={false}
        className="rounded-xl"
        style={{
          position: 'absolute',
          objectFit: 'cover',
          transform: 'scale(-1, 1)',
          width: '100%',
          height: '100%'
        }}
        videoConstraints={{
          facingMode: 'environment'
        }}
      />
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          objectFit: 'cover',
          // zIndex: 9,
          // backgroundColor: 'red',
          width: '100%',
          height: '100%'
        }}
      />
      <div ref={statsRef} />
      {/* @ts-ignore */}
      <animated.div ref={divVrmRef} style={frameSpringStyleProps}>
        <ThreeCanvas vrm={vrmFile} />
      </animated.div>
      <div
        style={{
          position: 'absolute',
          top: 20,
          left: 20
        }}
        className="bg-white p-2 rounded-full">
        <p className="text-black font-bold">Dwiyan Putra</p>
      </div>
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading} onClick={() => console.log('wait')}>
        <Stack direction="column" spacing={3}>
          <CircularProgress color="inherit" size={50} />
          <p>Loading ...</p>
        </Stack>
      </Backdrop>
    </div>
  )
}

export default WebcamWrapper
