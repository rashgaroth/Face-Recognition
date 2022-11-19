/* eslint-disable @typescript-eslint/no-explicit-any */
import * as tf from '@tensorflow/tfjs-core'
import * as facemesh from '@tensorflow-models/face-landmarks-detection'
import { GREEN, LABEL_TO_COLOR, NUM_IRIS_KEYPOINTS, NUM_KEYPOINTS, RED, TUNABLE_FLAG_VALUE_RANGE_MAP } from './params'
import { TRIANGULATION } from './triangulation'

export function isiOS() {
  return /iPhone|iPad|iPod/i.test(navigator.userAgent)
}

export function isAndroid() {
  return /Android/i.test(navigator.userAgent)
}

export function isMobile() {
  return isAndroid() || isiOS()
}

/**
 * Reset the target backend.
 *
 * @param backendName The name of the backend to be reset.
 */
async function resetBackend(backendName: string): Promise<void> {
  const ENGINE = tf.engine()
  if (!(backendName in ENGINE.registryFactory)) {
    throw new Error(`${backendName} backend is not registed.`)
  }

  if (backendName in ENGINE.registry) {
    const backendFactory = tf.findBackendFactory(backendName)
    tf.removeBackend(backendName)
    tf.registerBackend(backendName, backendFactory)
  }

  await tf.setBackend(backendName)
}

export async function setBackendAndEnvFlags(flagConfig: any = {}, backend: string) {
  if (flagConfig == null) {
    return
  } else if (typeof flagConfig !== 'object') {
    throw new Error(`An object is expected, while a(n) ${typeof flagConfig} is found.`)
  }

  // Check the validation of flags and values.
  for (const flag in flagConfig as any) {
    // TODO: check whether flag can be set as flagConfig[flag].
    if (!(flag in TUNABLE_FLAG_VALUE_RANGE_MAP)) {
      throw new Error(`${flag} is not a tunable or valid environment flag.`)
    }
    if ((TUNABLE_FLAG_VALUE_RANGE_MAP as any)[flag].indexOf(flagConfig[flag]) === -1) {
      throw new Error(
        `${flag} value is expected to be in the range [${(TUNABLE_FLAG_VALUE_RANGE_MAP as any)[flag]}], while ${flagConfig[flag]}` +
          ' is found.'
      )
    }
  }

  tf.env().setFlags(flagConfig)

  const [runtime, $backend] = backend.split('-')

  if (runtime === 'tfjs') {
    await resetBackend($backend)
  }
}

function distance(a: number[], b: number[]) {
  return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2))
}

type boxMinMax = number[]
type pointType = boxMinMax[]

function drawPath(ctx: CanvasRenderingContext2D, points: pointType, closePath: boolean) {
  const region = new Path2D()
  region.moveTo(points[0][0], points[0][1])
  for (let i = 1; i < points.length; i++) {
    const point = points[i]
    region.lineTo(point[0], point[1])
  }

  if (closePath) {
    region.closePath()
  }
  ctx.stroke(region)
}

export function drawResults(ctx: CanvasRenderingContext2D, faces: facemesh.Face[], triangulateMesh: boolean, boundingBox: boolean) {
  faces.forEach((face) => {
    const keypoints = face.keypoints.map((keypoint) => [keypoint.x, keypoint.y])
    if (boundingBox) {
      if (boundingBox) {
        ctx.strokeStyle = RED
        ctx.lineWidth = 1

        const box = face.box
        drawPath(
          ctx,
          [
            [box.xMin, box.yMin],
            [box.xMax, box.yMin],
            [box.xMax, box.yMax],
            [box.xMin, box.yMax]
          ],
          true
        )
      }
    }
    if (triangulateMesh) {
      ctx.strokeStyle = GREEN
      ctx.lineWidth = 0.5

      for (let i = 0; i < TRIANGULATION.length / 3; i++) {
        const points = [TRIANGULATION[i * 3], TRIANGULATION[i * 3 + 1], TRIANGULATION[i * 3 + 2]].map((index) => keypoints[index])

        drawPath(ctx, points, true)
      }
    } else {
      ctx.fillStyle = GREEN

      for (let i = 0; i < NUM_KEYPOINTS; i++) {
        const x = keypoints[i][0]
        const y = keypoints[i][1]

        ctx.beginPath()
        ctx.arc(x, y, 1 /* radius */, 0, 2 * Math.PI)
        ctx.fill()
      }
    }

    if (keypoints.length > NUM_KEYPOINTS) {
      ctx.strokeStyle = RED
      ctx.lineWidth = 1

      const leftCenter = keypoints[NUM_KEYPOINTS]
      const leftDiameterY = distance(keypoints[NUM_KEYPOINTS + 4], keypoints[NUM_KEYPOINTS + 2])
      const leftDiameterX = distance(keypoints[NUM_KEYPOINTS + 3], keypoints[NUM_KEYPOINTS + 1])

      ctx.beginPath()
      ctx.ellipse(leftCenter[0], leftCenter[1], leftDiameterX / 2, leftDiameterY / 2, 0, 0, 2 * Math.PI)
      ctx.stroke()

      if (keypoints.length > NUM_KEYPOINTS + NUM_IRIS_KEYPOINTS) {
        const rightCenter = keypoints[NUM_KEYPOINTS + NUM_IRIS_KEYPOINTS]
        const rightDiameterY = distance(
          keypoints[NUM_KEYPOINTS + NUM_IRIS_KEYPOINTS + 2],
          keypoints[NUM_KEYPOINTS + NUM_IRIS_KEYPOINTS + 4]
        )
        const rightDiameterX = distance(
          keypoints[NUM_KEYPOINTS + NUM_IRIS_KEYPOINTS + 3],
          keypoints[NUM_KEYPOINTS + NUM_IRIS_KEYPOINTS + 1]
        )

        ctx.beginPath()
        ctx.ellipse(rightCenter[0], rightCenter[1], rightDiameterX / 2, rightDiameterY / 2, 0, 0, 2 * Math.PI)
        ctx.stroke()
      }
    }

    const contours = facemesh.util.getKeypointIndexByContour(facemesh.SupportedModels.MediaPipeFaceMesh)

    for (const [label, contour] of Object.entries(contours)) {
      ctx.strokeStyle = LABEL_TO_COLOR[label]
      ctx.lineWidth = 3
      const path = contour.map((index) => keypoints[index])
      if (path.every((value) => value != undefined)) {
        drawPath(ctx, path, false)
      }
    }
  })
}
