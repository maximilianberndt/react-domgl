import { MeshProps, ShaderMaterialProps } from '@react-three/fiber'
import React, {
  ReactNode,
  Ref,
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
import fragmentShader from '../glsl/base/frag.glsl'
import vertexShader from '../glsl/base/vert.glsl'
import useSyncDomGl from '../hooks/useSyncDomGl'
import GlElement from './GlElement'
import { plane, textureLoader } from './GlRoot'

interface GlImageProps extends MeshProps {
  children: ReactNode
  domRef: Ref<HTMLImageElement>
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

    const image = domRef?.current
    const { sync } = useSyncDomGl(image, { syncScale: true })

    useEffect(() => {
      const src = image?.currentSrc || image?.src
      if (src) {
        textureLoader.load(src, (data) => {
          if (onTextureLoaded) onTextureLoaded(data)
          uniforms.tMap.value = data
        })
      }
    }, [image])

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
