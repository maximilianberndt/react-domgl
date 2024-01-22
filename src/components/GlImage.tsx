import React, { ReactNode, useEffect, useMemo } from 'react'
import { BufferGeometry } from 'three'
import fragmentShader from '../glsl/base/frag.glsl'
import vertexShader from '../glsl/base/vert.glsl'
import useSyncDomGl from '../hooks/useSyncDomGl'
import GlElement from './GlElement'
import { plane, textureLoader } from './GlRoot'

const GlImage = ({
  children,
  geometry,
  ...rest
}: {
  children: ReactNode
  geometry?: BufferGeometry
  [x: string]: any
}) => {
  const image = useMemo(() => children?.ref?.current, [children])

  const uniforms = useMemo(
    () => ({
      uPlaneSizes: { value: [1, 1] },
      uImageSizes: { value: [1, 1] },
      tMap: { value: {} },
    }),
    []
  )

  const { sync } = useSyncDomGl(image, { syncScale: true })

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
        <mesh {...rest} ref={sync} geometry={geometry || plane}>
          {/* TODO: Make target geometry optional */}
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
