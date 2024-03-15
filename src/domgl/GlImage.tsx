import { MeshProps, ShaderMaterialProps } from '@react-three/fiber'
import React, {
  ReactNode,
  RefObject,
  forwardRef,
  useEffect,
  useMemo,
} from 'react'
import {
  BufferGeometry,
  Material,
  Mesh,
  Texture,
  Uniform,
} from 'three'
import GlElement from './GlElement'
import fragmentShader from './glsl/base/frag'
import vertexShader from './glsl/base/vert'
import useSyncDomGl from './hooks/useSyncDomGl'
import { plane } from './utils/plane'
import { textureLoader } from './utils/textureLoader'

interface GlImageProps extends MeshProps {
  children: ReactNode
  domRef: RefObject<HTMLImageElement>
  geometry?: BufferGeometry
  shader?: ShaderMaterialProps
  material?: Material
  onTextureLoaded?: (texture: Texture) => void
}

const GlImage = forwardRef<Mesh, GlImageProps>(
  (
    {
      children,
      geometry,
      domRef,
      material,
      onTextureLoaded,
      // TODO: Update uniforms, pass more properties
      shader = {
        uniforms: {},
      },
      ...rest
    },
    ref
  ) => {
    const uniforms = useMemo(
      () => ({
        uPlaneSizes: new Uniform([1, 1]),
        uImageSizes: new Uniform([1, 1]),
        tMap: { value: {} },
        ...shader.uniforms,
      }),
      []
    )

    const { sync } = useSyncDomGl(domRef?.current, {
      syncScale: true,
    })

    useEffect(() => {
      const image = domRef?.current
      const src = image?.currentSrc || image?.src
      if (src) {
        textureLoader.load(src, (data) => {
          if (onTextureLoaded) onTextureLoaded(data)
          uniforms.tMap.value = data
        })
      }
    }, [])

    return (
      <>
        <GlElement>
          <mesh
            {...rest}
            ref={(el: Mesh) => {
              sync(el)
              if (ref) ref.current = el
            }}
            geometry={geometry || plane}
            material={material}
          >
            {!material && (
              <shaderMaterial
                fragmentShader={fragmentShader}
                vertexShader={vertexShader}
                {...shader}
                uniforms={uniforms}
              />
            )}
          </mesh>
        </GlElement>

        {children}
      </>
    )
  }
)

export default GlImage
