import { MeshProps, ShaderMaterialProps } from '@react-three/fiber'
import React, {
  ReactNode,
  RefObject,
  forwardRef,
  useEffect,
  useMemo,
} from 'react'
import { BufferGeometry, Material, Mesh, VideoTexture } from 'three'
import fragmentShader from '../glsl/base/frag.glsl'
import vertexShader from '../glsl/base/vert.glsl'
import useSyncDomGl from '../hooks/useSyncDomGl'
import GlElement from './GlElement'
import { plane } from './GlRoot'

interface GlVideoProps extends MeshProps {
  children: ReactNode
  domRef: RefObject<HTMLVideoElement>
  geometry?: BufferGeometry
  shader?: ShaderMaterialProps
  material?: Material
}

const GlVideo = forwardRef<Mesh, GlVideoProps>(
  (
    {
      children,
      geometry,
      domRef,
      material,
      // TODO: Update uniforms, pass more properties
      shader = {
        uniforms: {},
      },
      ...rest
    },
    ref
  ) => {
    const video = domRef?.current

    const uniforms = useMemo(
      () => ({
        uPlaneSizes: { value: [1, 1] },
        uImageSizes: { value: [1, 1] },
        tMap: { value: {} },
        ...shader.uniforms,
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
          <mesh
            {...rest}
            ref={(el: Mesh) => {
              sync(el)
              if (ref?.current) ref.current = el
            }}
            geometry={geometry || plane}
          >
            <shaderMaterial
              fragmentShader={fragmentShader}
              vertexShader={vertexShader}
              {...shader}
              uniforms={uniforms}
            />
          </mesh>
        </GlElement>

        {children}
      </>
    )
  }
)

export default GlVideo
