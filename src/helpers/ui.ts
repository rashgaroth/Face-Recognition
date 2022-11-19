import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils'
import { Results } from '@mediapipe/face_mesh'
import { Results as PoseResults } from '@mediapipe/pose'
import React from 'react'
import {
  FACEMESH_FACE_OVAL,
  FACEMESH_LEFT_EYE,
  FACEMESH_LEFT_EYEBROW,
  FACEMESH_LEFT_IRIS,
  FACEMESH_LIPS,
  FACEMESH_RIGHT_EYE,
  FACEMESH_RIGHT_EYEBROW,
  FACEMESH_RIGHT_IRIS,
  FACEMESH_TESSELATION,
  POSE_CONNECTIONS
} from '@mediapipe/holistic'
import * as facemesh from '@tensorflow-models/face-landmarks-detection'
import Webcam from 'react-webcam'
import { drawResults } from '@shared/tsfjs/util'

export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export const createCanvasContext = (ref: React.MutableRefObject<HTMLCanvasElement>): CanvasRenderingContext2D =>
  ref.current.getContext('2d')

export const drawFace = (res: Results, canvasRef: React.MutableRefObject<HTMLCanvasElement>) => {
  const canvasCtx = canvasRef.current.getContext('2d')

  canvasCtx.save()
  const canvasElement = canvasRef.current
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height)
  canvasCtx.drawImage(res.image, 0, 0, canvasElement.width, canvasElement.height)
  if (res.multiFaceLandmarks) {
    for (const landmarks of res.multiFaceLandmarks) {
      drawConnectors(canvasCtx, landmarks, FACEMESH_TESSELATION, { color: '#C0C0C070', lineWidth: 1 })
      drawConnectors(canvasCtx, landmarks, FACEMESH_RIGHT_EYE, { color: '#FF3030' })
      drawConnectors(canvasCtx, landmarks, FACEMESH_RIGHT_EYEBROW, { color: '#FF3030' })
      drawConnectors(canvasCtx, landmarks, FACEMESH_RIGHT_IRIS, { color: '#FF3030' })
      drawConnectors(canvasCtx, landmarks, FACEMESH_LEFT_EYE, { color: '#30FF30' })
      drawConnectors(canvasCtx, landmarks, FACEMESH_LEFT_EYEBROW, { color: '#30FF30' })
      drawConnectors(canvasCtx, landmarks, FACEMESH_LEFT_IRIS, { color: '#30FF30' })
      drawConnectors(canvasCtx, landmarks, FACEMESH_FACE_OVAL, { color: '#E0E0E0' })
      drawConnectors(canvasCtx, landmarks, FACEMESH_LIPS, { color: '#E0E0E0' })
    }
  }
  canvasCtx.restore()
}

export const runDeprecatedFacemesh = async (
  webcamRef: React.MutableRefObject<Webcam>,
  canvasRef: React.MutableRefObject<HTMLCanvasElement>
) => {
  try {
    const net = await facemesh.createDetector(facemesh.SupportedModels.MediaPipeFaceMesh, {
      runtime: 'mediapipe',
      refineLandmarks: false,
      solutionPath: `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh`
    })

    setInterval(() => {
      detectDeprecatedFacemesh(net, webcamRef, canvasRef)
    }, 100)
  } catch (error) {
    console.log(error, '@errorRunFacemesh?')
  }
}

const detectDeprecatedFacemesh = async (
  net: facemesh.FaceLandmarksDetector,
  webcamRef: React.MutableRefObject<Webcam>,
  canvasRef: React.MutableRefObject<HTMLCanvasElement>
) => {
  if (webcamRef.current && webcamRef.current.video?.readyState === 4 && canvasRef.current) {
    const video = webcamRef.current.video
    const videoWidth = webcamRef.current.video.videoWidth
    const videoHeight = webcamRef.current.video.videoHeight

    webcamRef.current.video.width = videoWidth
    webcamRef.current.video.height = videoHeight

    canvasRef.current.width = videoWidth
    canvasRef.current.height = videoHeight

    try {
      const canvCtx = canvasRef.current.getContext('2d')
      canvCtx.drawImage(video, 0, 0)
      const face = await net.estimateFaces(video, { flipHorizontal: false })
      requestAnimationFrame(() => {
        drawResults(canvCtx, face, true, true)
      })
    } catch (error) {
      net.dispose()
      console.error({ error })
    }
  }
}

export const drawPose = (results: PoseResults, canvasRef: React.MutableRefObject<HTMLCanvasElement>) => {
  const grid = new (window as any).LandmarkGrid(canvasRef.current)
  if (!results.poseLandmarks) {
    grid.updateLandmarks([])
    return
  }
  const ctx = createCanvasContext(canvasRef)
  const el = canvasRef.current

  ctx.save()
  ctx.clearRect(0, 0, el.width, el.height)
  ctx.drawImage(results.segmentationMask, 0, 0, el.width, el.height)

  ctx.globalCompositeOperation = 'darken'
  drawConnectors(ctx, results.poseLandmarks, POSE_CONNECTIONS, { color: '#00FF00', lineWidth: 4 })
  drawLandmarks(ctx, results.poseLandmarks, {
    color: '#FF0000',
    lineWidth: 2
  })
  ctx.restore()

  grid.updateLandmarks(results.poseWorldLandmarks)
}
