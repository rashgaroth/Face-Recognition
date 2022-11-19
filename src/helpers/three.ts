import { vrmFile } from 'config'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { VRMLoaderPlugin, VRMUtils, VRM, VRMHumanBoneName } from '@pixiv/three-vrm'
import * as Kalidokit from 'kalidokit'
import { FACEMESH_TESSELATION, HAND_CONNECTIONS, POSE_CONNECTIONS, Results } from '@mediapipe/holistic'
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils'

const me = window
const doc = document
export const oldLookTarget = new THREE.Euler()
export const threeClock = new THREE.Clock()
export const getScene = () => new THREE.Scene()
export const appendThree = (vrm: VRM, canvas?: HTMLCanvasElement | HTMLDivElement) => {
  if (!me || !doc) {
    console.warn('window | document is not defined')
    return
  }

  const renderer = new THREE.WebGL1Renderer({ alpha: true })
  renderer.setSize(canvas.offsetWidth, canvas.offsetHeight)
  renderer.setPixelRatio(me.devicePixelRatio)
  console.log('renderer: ', renderer.domElement)
  // renderer.domElement.style.zIndex = '1000'
  canvas.style.zIndex = '999'
  if (canvas) {
    console.log(`Append to div | canvas`, {
      width: renderer.domElement.width,
      height: renderer.domElement.height
    })
    canvas.appendChild(renderer.domElement)
  } else {
    doc.body.appendChild(renderer.domElement)
  }

  const orbitCamera = new THREE.PerspectiveCamera(35, me.innerWidth, me.innerHeight)
  orbitCamera.position.set(0.0, 1.4, 0.7)

  const orbitControls = new OrbitControls(orbitCamera, renderer.domElement)
  orbitControls.screenSpacePanning = true
  orbitControls.target.set(0.0, 1.4, 0.0)
  orbitControls.update()

  const scene = getScene()
  const light = new THREE.DirectionalLight(0xffffff)
  light.position.set(1.0, 1.0, 1.0).normalize()
  scene.add(light)

  console.log({ scene })

  animateFrame(renderer, scene, orbitCamera, vrm)
}
export const animateFrame = (renderer: THREE.WebGL1Renderer, scene: THREE.Scene, orbitCamera: THREE.PerspectiveCamera, vrm: VRM) => {
  requestAnimationFrame(() => animateFrame(renderer, scene, orbitCamera, vrm))
  if (vrm) {
    vrm.update(threeClock.getDelta())
  }
  renderer.render(scene, orbitCamera)
}
// eslint-disable-next-line no-unused-vars
export const loadVRM = (scene: THREE.Scene, setVrm: (vrm: VRM) => void) => {
  const loader = new GLTFLoader()
  loader.crossOrigin = 'anonymous'
  loader.register((parser) => {
    return new VRMLoaderPlugin(parser)
  })
  loader.load(
    vrmFile,
    (gltf) => {
      VRMUtils.removeUnnecessaryJoints(gltf.scene)
      const vrm = gltf.userData?.vrm as VRM
      scene.add(vrm.scene)
      setVrm(vrm)
      console.log({ vrm })
    },
    (progress) => console.log('Loading model...', 100.0 * (progress.loaded / progress.total), '%'),
    (error) => console.error(error, `Error while load GLTF`)
  )
}
export const rigRotation = (
  name: VRMHumanBoneName,
  rotation: { x: number; y: number; z: number } = { x: 0, y: 0, z: 0 },
  dampener = 1,
  lerpAmount = 0.3,
  vrm: VRM
) => {
  if (!vrm) {
    console.warn('vrm is not defined or null')
    return
  }
  const part = vrm.humanoid.getNormalizedBoneNode(name)

  if (!part) {
    console.warn('part is not defined')
    return
  }

  const euler = new THREE.Euler(rotation.x * dampener, rotation.y * dampener, rotation.z * dampener)
  const quaternion = new THREE.Quaternion().setFromEuler(euler)
  part.quaternion.slerp(quaternion, lerpAmount)
}
export const rigPosition = (
  name: VRMHumanBoneName,
  position: { x: number; y: number; z: number } = { x: 0, y: 0, z: 0 },
  dampener = 1,
  lerpAmount = 0.3,
  vrm: VRM
) => {
  if (!vrm) {
    console.warn('vrm is not defined or null')
    return
  }

  const part = vrm.humanoid.getNormalizedBoneNode(name)
  if (!part) {
    console.warn('part is null or not defined')
    return
  }

  const vector = new THREE.Vector3(position.x * dampener, position.y * dampener, position.z * dampener)
  part.position.lerp(vector, lerpAmount)
}
export const animateVRM = (vrm: VRM, results: Results, video: HTMLVideoElement) => {
  if (!vrm) {
    return
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  let riggedPose: Kalidokit.TPose, riggedLeftHand: Kalidokit.THand<'Left'>, riggedRightHand: Kalidokit.THand<'Right'>, riggedFace
  const pose2DLandmarks = results.poseLandmarks
  // const faceLandmarks = results.faceLandmarks
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pose3DLandmarks = (results as any).ea
  const leftHandLandmarks = results.leftHandLandmarks
  const rightHandLandmarks = results.rightHandLandmarks

  if (pose2DLandmarks && pose3DLandmarks) {
    riggedPose = Kalidokit.Pose.solve(pose3DLandmarks, pose2DLandmarks, {
      runtime: 'mediapipe',
      video
    })
    rigRotation('hips', riggedPose.Hips.rotation, 0.7, 0.3, vrm)
    rigPosition(
      'hips',
      {
        x: -riggedPose.Hips.position.x, // Reverse direction
        y: riggedPose.Hips.position.y + 1, // Add a bit of height
        z: -riggedPose.Hips.position.z // Reverse direction
      },
      1,
      0.07,
      vrm
    )

    // chest and spine
    rigRotation('chest', riggedPose.Spine, 0.25, 0.3, vrm)
    rigRotation('spine', riggedPose.Spine, 0.45, 0.3, vrm)

    // arms
    rigRotation('rightUpperArm', riggedPose.RightLowerArm, 1, 0.3, vrm)
    rigRotation('rightLowerArm', riggedPose.RightLowerArm, 1, 0.3, vrm)
    rigRotation('leftUpperArm', riggedPose.LeftUpperArm, 1, 0.3, vrm)
    rigRotation('leftLowerArm', riggedPose.LeftLowerArm, 1, 0.3, vrm)

    // legs
    rigRotation('leftUpperLeg', riggedPose.LeftUpperLeg, 1, 0.3, vrm)
    rigRotation('rightUpperLeg', riggedPose.RightUpperLeg, 1, 0.3, vrm)
    rigRotation('leftLowerLeg', riggedPose.LeftLowerLeg, 1, 0.3, vrm)
    rigRotation('rightLowerLeg', riggedPose.RightLowerLeg, 1, 0.3, vrm)
  }

  // animate left hand
  if (leftHandLandmarks) {
    riggedLeftHand = Kalidokit.Hand.solve(leftHandLandmarks, 'Left')
    rigRotation(
      'leftHand',
      {
        z: riggedPose.LeftHand.z,
        y: riggedLeftHand.LeftWrist.y,
        x: riggedLeftHand.LeftWrist.x
      },
      1,
      0.3,
      vrm
    )
    // ring
    rigRotation('leftRingProximal', riggedLeftHand.LeftRingProximal, 1, 0.3, vrm)
    rigRotation('leftRingIntermediate', riggedLeftHand.LeftRingIntermediate, 1, 0.3, vrm)
    rigRotation('leftRingDistal', riggedLeftHand.LeftRingDistal, 1, 0.3, vrm)
    // index
    rigRotation('leftIndexProximal', riggedLeftHand.LeftIndexProximal, 1, 0.3, vrm)
    rigRotation('leftIndexIntermediate', riggedLeftHand.LeftIndexIntermediate, 1, 0.3, vrm)
    rigRotation('leftIndexDistal', riggedLeftHand.LeftIndexDistal, 1, 0.3, vrm)
    // middle
    rigRotation('leftMiddleProximal', riggedLeftHand.LeftMiddleProximal, 1, 0.3, vrm)
    rigRotation('leftMiddleIntermediate', riggedLeftHand.LeftMiddleIntermediate, 1, 0.3, vrm)
    rigRotation('leftMiddleDistal', riggedLeftHand.LeftMiddleDistal, 1, 0.3, vrm)
    // thumb
    rigRotation('leftThumbProximal', riggedLeftHand.LeftThumbProximal, 1, 0.3, vrm)
    rigRotation('leftThumbMetacarpal', riggedLeftHand.LeftThumbIntermediate, 1, 0.3, vrm)
    rigRotation('leftThumbDistal', riggedLeftHand.LeftThumbDistal, 1, 0.3, vrm)
    // little
    rigRotation('leftLittleProximal', riggedLeftHand.LeftLittleProximal, 1, 0.3, vrm)
    rigRotation('leftLittleIntermediate', riggedLeftHand.LeftLittleIntermediate, 1, 0.3, vrm)
    rigRotation('leftLittleDistal', riggedLeftHand.LeftLittleDistal, 1, 0.3, vrm)
  }
  // animate right hand
  if (rightHandLandmarks) {
    riggedRightHand = Kalidokit.Hand.solve(rightHandLandmarks, 'Right')
    rigRotation(
      'rightHand',
      {
        z: riggedPose.RightHand.z,
        y: riggedRightHand.RightWrist.y,
        x: riggedRightHand.RightWrist.x
      },
      1,
      0.3,
      vrm
    )
    // ring
    rigRotation('rightRingProximal', riggedRightHand.RightRingProximal, 1, 0.3, vrm)
    rigRotation('rightRingIntermediate', riggedRightHand.RightRingIntermediate, 1, 0.3, vrm)
    rigRotation('rightRingDistal', riggedRightHand.RightRingDistal, 1, 0.3, vrm)
    // index
    rigRotation('rightIndexProximal', riggedRightHand.RightIndexProximal, 1, 0.3, vrm)
    rigRotation('rightIndexIntermediate', riggedRightHand.RightIndexIntermediate, 1, 0.3, vrm)
    rigRotation('rightIndexDistal', riggedRightHand.RightIndexDistal, 1, 0.3, vrm)
    // middle
    rigRotation('rightMiddleProximal', riggedRightHand.RightMiddleProximal, 1, 0.3, vrm)
    rigRotation('rightMiddleIntermediate', riggedRightHand.RightMiddleIntermediate, 1, 0.3, vrm)
    rigRotation('rightMiddleDistal', riggedRightHand.RightMiddleDistal, 1, 0.3, vrm)
    // thumb
    rigRotation('rightThumbProximal', riggedRightHand.RightThumbProximal, 1, 0.3, vrm)
    rigRotation('rightThumbMetacarpal', riggedRightHand.RightThumbIntermediate, 1, 0.3, vrm)
    rigRotation('rightThumbDistal', riggedRightHand.RightThumbDistal, 1, 0.3, vrm)
    // little
    rigRotation('rightLittleProximal', riggedRightHand.RightLittleProximal, 1, 0.3, vrm)
    rigRotation('rightLittleIntermediate', riggedRightHand.RightLittleIntermediate, 1, 0.3, vrm)
    rigRotation('rightLittleDistal', riggedRightHand.RightLittleDistal, 1, 0.3, vrm)
  }
}
export const drawCanvas = (results: Results, canvas: HTMLCanvasElement) => {
  const ctx = canvas.getContext('2d')
  ctx.save()
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  drawConnectors(ctx, results.poseLandmarks, POSE_CONNECTIONS, {
    color: '#00cff7',
    lineWidth: 4
  })
  drawLandmarks(ctx, results.poseLandmarks, {
    color: '#ff0364',
    lineWidth: 2
  })
  drawConnectors(ctx, results.faceLandmarks, FACEMESH_TESSELATION, {
    color: '#C0C0C070',
    lineWidth: 1
  })
  if (results.faceLandmarks && results.faceLandmarks.length === 478) {
    drawLandmarks(ctx, [results.faceLandmarks[468], results.faceLandmarks[468 + 5]], {
      color: '#ffe603',
      lineWidth: 2
    })
  }
  drawConnectors(ctx, results.leftHandLandmarks, HAND_CONNECTIONS, {
    color: '#eb1064',
    lineWidth: 5
  })
  drawLandmarks(ctx, results.leftHandLandmarks, {
    color: '#00cff7',
    lineWidth: 2
  })
  drawConnectors(ctx, results.rightHandLandmarks, HAND_CONNECTIONS, {
    color: '#22c3e3',
    lineWidth: 5
  })
  drawLandmarks(ctx, results.rightHandLandmarks, {
    color: '#ff0364',
    lineWidth: 2
  })
}
