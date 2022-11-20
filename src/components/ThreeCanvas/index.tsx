/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unknown-property */
import React, { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { VRM } from '@pixiv/three-vrm'
import { OrbitControls } from '@react-three/drei'
import { animateVRM, loadVRM } from '@helper/three'
import { Camera } from '@mediapipe/camera_utils'
import { Holistic, Results as HolisticsResults } from '@mediapipe/holistic'

const deg2rad = (degrees) => degrees * (Math.PI / 180)

function Avatar(props: { onVrmLoaded: (vrm: VRM) => void; video?: HTMLVideoElement; canvas?: HTMLCanvasElement }) {
  const [vrm, setVrm] = useState<VRM | null>(null)
  const { scene, camera } = useThree()
  const avatar = useRef<VRM>()

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

    const camera = new Camera(props.video, {
      onFrame: async () => {
        await holistic.send({ image: props.video })
      },
      width: 640,
      height: 480
    })

    camera.start()
  }

  const initAndAnimate = (res: HolisticsResults) => {
    if (avatar.current) {
      // drawCanvas(res, props.canvas)
      animateVRM(avatar.current, res, props.video)
    }
  }

  useEffect(() => {
    loadVRM(scene, (vrm) => {
      setVrm(vrm)
      /* 
        Uncomment this function if you want to activate the AI, this commented because 
        i'm debugging the UI
      */
      // setupHolistic()
    })
  }, [props.video, props.canvas])

  useEffect(() => {
    if (vrm !== null) {
      avatar.current = vrm
      avatar.current.lookAt.target = camera
      camera.rotation.set(deg2rad(90), 90, 0)
      camera.zoom = 2
      vrm.humanoid.getNormalizedBone('hips').node.rotation.y = Math.PI
      props.onVrmLoaded(vrm)
    }
  }, [vrm, camera])

  useFrame(({ clock }, delta) => {
    if (vrm) {
      avatar.current.update(delta)
    }
  })

  return vrm !== null && <primitive object={vrm.scene}></primitive>
}

export default function ThreeCanvas(props: { onVrmLoaded: (vrm: VRM) => void; video?: HTMLVideoElement; canvas?: HTMLCanvasElement }) {
  return (
    <Canvas
      camera={{ fov: 35, aspect: window.innerWidth / window.innerHeight, near: 0.1, far: 1000 }}
      style={{ width: '100%', height: '100%', zIndex: 9 }}>
      <OrbitControls target={[0.0, 1.4, 0.7]} rotation={[0, 0, 0]} />
      <ambientLight position={[1.0, 1.0, 1.0]} />
      <pointLight position={[1.0, 1.0, 1.0]} />
      <Suspense fallback={null}>
        <Avatar onVrmLoaded={props.onVrmLoaded} canvas={props.canvas} video={props.video} />
      </Suspense>
    </Canvas>
  )
}
