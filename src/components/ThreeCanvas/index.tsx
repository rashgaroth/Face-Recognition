/* eslint-disable react/no-unknown-property */
import React, { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { BufferGeometry, Material, Mesh, Object3D } from 'three'
import { VRM, VRMLoaderPlugin, VRMUtils } from '@pixiv/three-vrm'
import { useControls } from 'leva'
import { useGLTF, OrbitControls } from '@react-three/drei'
import { GLTFParser } from 'three/examples/jsm/loaders/GLTFLoader'
import { loadVRM } from '@helper/three'

function Box(props) {
  const mesh = useRef<Mesh<BufferGeometry, Material | Material[]>>(null)
  const [hovered, setHover] = useState(false)
  const [active, setActive] = useState(false)
  useFrame((state, delta) => (mesh.current.rotation.x += 0.01))
  const { gl } = useThree()

  gl.setPixelRatio(window.devicePixelRatio)

  return (
    <mesh
      {...props}
      ref={mesh}
      scale={active ? 1.5 : 1}
      onClick={() => setActive(!active)}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  )
}

function Avatar(props: { vrm: string }) {
  const [vrm, setVrm] = useState<VRM | null>(null)
  // const { leftShoulder, rightShoulder } = useControls({
  //   leftShoulder: { value: 0, min: -1, max: 1 },
  //   rightShoulder: { value: 0, min: -1, max: 1 }
  // })
  const { scene, camera } = useThree()
  // const gltf = useGLTF('/model.vrm', false, false, (loader) => {
  //   loader.register((parser: GLTFParser) => {
  //     return new VRMLoaderPlugin(parser)
  //   })
  // })
  const avatar = useRef<VRM>()
  // const [bonesStore, setBonesStore] = useState<{ [part: string]: Object3D }>({})

  // useEffect(() => {
  //   if (gltf) {
  //     VRMUtils.removeUnnecessaryJoints(gltf.scene)
  //     const vrm = gltf.userData?.vrm as VRM
  //     console.log(gltf.userData)
  //     if (vrm) {
  //       console.log({ vrm })
  //       avatar.current = vrm
  //       vrm.humanoid.getNormalizedBoneNode('hips').rotation.y = Math.PI

  //       const bones = {
  //         neck: vrm.humanoid.getNormalizedBoneNode('neck'),
  //         hips: vrm.humanoid.getNormalizedBoneNode('hips'),
  //         LeftShoulder: vrm.humanoid.getNormalizedBoneNode('leftShoulder'),
  //         RightShoulder: vrm.humanoid.getNormalizedBoneNode('rightShoulder')
  //       }

  //       // bones.RightShoulder.rotation.z = -Math.PI / 4
  //       vrm.lookAt.target = camera
  //       setBonesStore(bones)
  //     }
  //   }
  // }, [scene, gltf, camera])

  useEffect(() => {
    loadVRM(scene, (vrm) => {
      setVrm(vrm)
    })
  }, [])

  useEffect(() => {
    if (vrm !== null) {
      console.log({ vrm }, 'from Three')
      avatar.current = vrm
      vrm.humanoid.getNormalizedBoneNode('hips').rotation.y = Math.PI
      vrm.lookAt.target = camera
      avatar.current = vrm
      console.log({ vrm })
    }
  }, [vrm])

  return vrm !== null && <primitive object={vrm.scene}></primitive>
}

export default function ThreeCanvas(props: { vrm: string }) {
  return (
    <Canvas camera={{ position: [2, 2.3, 2.3] }} dpr={[3, 2.5]}>
      <OrbitControls />
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <Suspense fallback={null}>
        <Avatar vrm={props.vrm} />
      </Suspense>
    </Canvas>
  )
}
