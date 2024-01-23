import { Float } from '@react-three/drei'

import React, { useEffect, useRef } from 'react'
import { MeshNormalMaterial } from 'three'

import GlElement from '../components/GlElement'
import { useGltfLoader } from '../components/GlRoot'
import useSyncDomGl from '../hooks/useSyncDomGl'

const Model = ({ src = '' }) => {
  const ref = useRef<HTMLDivElement>(null)
  const gltf = useGltfLoader('/ym.glb')

  const { sync } = useSyncDomGl(ref.current, { syncScale: false })

  useEffect(() => {
    if (!gltf.scene) return

    const material = new MeshNormalMaterial()

    gltf.scene.traverse((node) => {
      node.material = material
    })
  }, [gltf.scene])

  return (
    <div
      ref={ref}
      style={{
        width: '50%',
        aspectRatio: 1 / 1,
        margin: '5vw auto',
      }}
    >
      <GlElement>
        <Float
          speed={2}
          rotationIntensity={0.4} // XYZ rotation intensity, defaults to 1
          floatIntensity={0.2} // Up/down float intensity, works like a multiplier with floatingRange,defaults to 1
          floatingRange={[-0.5, 0.5]}
        >
          <primitive object={gltf.scene} scale={3} ref={sync} />
        </Float>
      </GlElement>
    </div>
  )
}

export default Model
