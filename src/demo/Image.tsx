import { useLenis } from '@studio-freight/react-lenis'
import React, { CSSProperties, useRef } from 'react'
import { BufferGeometry, Mesh, RepeatWrapping } from 'three'
import GlImage from '../domgl/GlImage'

const fragmentShader = /*glsl*/ `
uniform vec3 uColor;

uniform vec2 uImageSizes;
uniform vec2 uPlaneSizes;
uniform highp sampler2D tMap;
uniform float uVelocity;

varying vec2 vUv;

void main() {
  vec2 ratio = vec2(
    min((uPlaneSizes.x / uPlaneSizes.y) / (uImageSizes.x / uImageSizes.y), 1.0),
    min((uPlaneSizes.y / uPlaneSizes.x) / (uImageSizes.y / uImageSizes.x), 1.0)
  );

  vec2 uv = vec2(
    vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
    vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
  );

  float blocks = 4.0;
  float x = floor(uv.x * blocks) / blocks;
  float y = floor(uv.y * blocks) / blocks;

  float distortionStrength = abs(uVelocity);
  vec2 distortion = distortionStrength * vec2(
    0.,
    sin(y * -1.5 + cos(x * 2.))
  );

  vec4 color = texture2D(tMap, uv - distortion);

  gl_FragColor.rgb = color.rgb;
  gl_FragColor.a = 1.;
}
`

const Image = ({
  src,
  style,
  geometry,
}: {
  src: string
  style: CSSProperties
  geometry?: BufferGeometry
}) => {
  const glRef = useRef<Mesh>(null)
  const domRef = useRef<HTMLImageElement>(null)

  useLenis(({ velocity }) => {
    const mesh = glRef.current
    if (!mesh) return

    mesh.material.uniforms.uVelocity.value = Math.abs(velocity * 0.01)
  })

  return (
    <GlImage
      ref={glRef}
      geometry={geometry}
      domRef={domRef}
      onTextureLoaded={(texture) => {
        texture.wrapS = RepeatWrapping
        texture.wrapT = RepeatWrapping
      }}
      shader={{
        uniforms: { uVelocity: { value: 0 } },
        fragmentShader,
      }}
    >
      <img ref={domRef} src={src} style={style} />
    </GlImage>
  )
}

export default Image
