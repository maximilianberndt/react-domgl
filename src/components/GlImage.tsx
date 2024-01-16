import React, { useEffect, useMemo, useRef } from 'react'
import { Mesh } from 'three'
import fragmentShader from '../glsl/base/frag.glsl'
import vertexShader from '../glsl/base/vert.glsl'
import useSyncDomGl from '../hooks/useSyncDomGl'
import GlElement from './GlElement'
import { textureLoader } from './GlRoot'

const GlImage = ({ children }) => {
  const ref = useRef<Mesh>(null)
  const image = children?.ref?.current

  const uniforms = useMemo(
    () => ({
      uPlaneSizes: { value: [1, 1] },
      uImageSizes: { value: [1, 1] },
      tMap: { value: {} },
    }),
    []
  )

  useSyncDomGl(ref.current, image, { syncScale: true })

  useEffect(() => {
    const src = image?.currentSrc || image?.src
    if (src) {
      textureLoader.load(src, (data) => {
        uniforms.tMap.value = data
      })
    }
  }, [image])

  return (
    <>
      <GlElement>
        <mesh ref={ref}>
          <planeGeometry args={[1, 1, 1]} />
          <shaderMaterial
            uniforms={uniforms}
            fragmentShader={fragmentShader}
            vertexShader={vertexShader}
          />
        </mesh>
      </GlElement>

      {children}
    </>
  )
}

export default GlImage
