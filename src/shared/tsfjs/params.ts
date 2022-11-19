/* eslint-disable @typescript-eslint/no-explicit-any */
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection'

export const NUM_KEYPOINTS = 468
export const NUM_IRIS_KEYPOINTS = 5
export const GREEN = '#32EEDB'
export const RED = '#FF2C35'
export const BLUE = '#157AB3'

export const VIDEO_SIZE = {
  '640 X 480': { width: 640, height: 480 },
  '640 X 360': { width: 640, height: 360 },
  '360 X 270': { width: 360, height: 270 }
}
export const STATE = {
  camera: { targetFPS: 60, sizeOption: '640 X 480' } as any,
  backend: '' as string,
  flags: {} as any,
  modelConfig: {} as any
}
export const MEDIAPIPE_FACE_CONFIG = {
  maxFaces: 1,
  refineLandmarks: true,
  triangulateMesh: true,
  boundingBox: true
}
export const LABEL_TO_COLOR = {
  lips: '#E0E0E0',
  leftEye: '#30FF30',
  leftEyebrow: '#30FF30',
  leftIris: '#30FF30',
  rightEye: '#FF3030',
  rightEyebrow: '#FF3030',
  rightIris: '#FF3030',
  faceOval: '#E0E0E0'
}

export const TUNABLE_FLAG_VALUE_RANGE_MAP = {
  WEBGL_VERSION: [1, 2],
  WASM_HAS_SIMD_SUPPORT: [true, false],
  WASM_HAS_MULTITHREAD_SUPPORT: [true, false],
  WEBGL_CPU_FORWARD: [true, false],
  WEBGL_PACK: [true, false],
  WEBGL_FORCE_F16_TEXTURES: [true, false],
  WEBGL_RENDER_FLOAT32_CAPABLE: [true, false],
  WEBGL_FLUSH_THRESHOLD: [-1, 0, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2],
  CHECK_COMPUTATION_FOR_ERRORS: [true, false]
} as {
  WEBGL_VERSION: number[]
  WASM_HAS_SIMD_SUPPORT: boolean[]
  WASM_HAS_MULTITHREAD_SUPPORT: boolean[]
  WEBGL_CPU_FORWARD: boolean[]
  WEBGL_PACK: boolean[]
  WEBGL_FORCE_F16_TEXTURES: boolean[]
  WEBGL_RENDER_FLOAT32_CAPABLE: boolean[]
  WEBGL_FLUSH_THRESHOLD: number[]
  CHECK_COMPUTATION_FOR_ERRORS: boolean[]
}

export const BACKEND_FLAGS_MAP = {
  ['tfjs-wasm']: ['WASM_HAS_SIMD_SUPPORT', 'WASM_HAS_MULTITHREAD_SUPPORT'],
  ['tfjs-webgl']: [
    'WEBGL_VERSION',
    'WEBGL_CPU_FORWARD',
    'WEBGL_PACK',
    'WEBGL_FORCE_F16_TEXTURES',
    'WEBGL_RENDER_FLOAT32_CAPABLE',
    'WEBGL_FLUSH_THRESHOLD'
  ],
  ['mediapipe-gpu']: []
}

export const MODEL_BACKEND_MAP = {
  [faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh]: ['mediapipe-gpu', 'tfjs-webgl']
}

export const TUNABLE_FLAG_NAME_MAP = {
  PROD: 'production mode',
  WEBGL_VERSION: 'webgl version',
  WASM_HAS_SIMD_SUPPORT: 'wasm SIMD',
  WASM_HAS_MULTITHREAD_SUPPORT: 'wasm multithread',
  WEBGL_CPU_FORWARD: 'cpu forward',
  WEBGL_PACK: 'webgl pack',
  WEBGL_FORCE_F16_TEXTURES: 'enforce float16',
  WEBGL_RENDER_FLOAT32_CAPABLE: 'enable float32',
  WEBGL_FLUSH_THRESHOLD: 'GL flush wait time(ms)'
}
