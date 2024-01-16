import React, { useEffect, useMemo, useRef } from 'react'
import { Mesh, VideoTexture } from 'three'
import fragmentShader from '../glsl/base/frag.glsl'
import vertexShader from '../glsl/base/vert.glsl'
import useSyncDomGl from '../hooks/useSyncDomGl'
import GlElement from './GlElement'

const GlVideo = ({ children }) => {
  const ref = useRef<Mesh>(null)
  const video = children?.ref?.current

  const uniforms = useMemo(
    () => ({
      uPlaneSizes: { value: [1, 1] },
      uImageSizes: { value: [1, 1] },
      tMap: { value: {} },
    }),
    []
  )

  useSyncDomGl(ref.current, video, { syncScale: true })

  useEffect(() => {
    if (video) uniforms.tMap.value = new VideoTexture(video)
  }, [video])

  return (
    <>
      <GlElement>
        <mesh
          ref={ref}
          onClick={() => {
            if (!video) return
            video.paused ? video.play() : video.pause()
          }}
        >
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

export default GlVideo
