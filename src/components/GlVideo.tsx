import React, { ReactNode, useEffect, useMemo } from 'react'
import { BufferGeometry, VideoTexture } from 'three'
import fragmentShader from '../glsl/base/frag.glsl'
import vertexShader from '../glsl/base/vert.glsl'
import useSyncDomGl from '../hooks/useSyncDomGl'
import GlElement from './GlElement'
import { plane } from './GlRoot'

const GlVideo = ({
  children,
  geometry,
  ...rest
}: {
  children: ReactNode
  geometry?: BufferGeometry
  [x: string]: any
}) => {
  const video = useMemo(() => children?.ref?.current, [children])

  const uniforms = useMemo(
    () => ({
      uPlaneSizes: { value: [1, 1] },
      uImageSizes: { value: [1, 1] },
      tMap: { value: {} },
    }),
    []
  )

  const { sync } = useSyncDomGl(video, { syncScale: true })

  useEffect(() => {
    if (video) uniforms.tMap.value = new VideoTexture(video)
  }, [video])

  return (
    <>
      <GlElement>
        <mesh {...rest} ref={sync} geometry={geometry || plane}>
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

export default GlVideo
