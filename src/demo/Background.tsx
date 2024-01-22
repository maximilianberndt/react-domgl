import { useFrame } from '@react-three/fiber'
import React, { useMemo, useRef } from 'react'

const vertexShader = /* glsl */ `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = modelMatrix * vec4(position, 1.0);
}`

const fragmentShader = /* glsl */ `
varying vec2 vUv;
uniform float uTime;

mat2 rotation2d(float angle) {
float s = sin(angle);
float c = cos(angle);

return mat2(
    c, -s,
    s, c
);
}
  
vec2 rotate(vec2 v, float angle) {
  return rotation2d(angle) * v;
}

float random(vec2 co) {
	return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
  vec2 uv = vUv;
  uv *= rotate(uv, uTime * 0.1);

  float mixer = (uv.x + uv.y) / 2.;

  vec3 color = mix(
    vec3(0.95),
    vec3(0.7),
    mixer
  );

  float uGrain = 0.09;
  float grain = mix(-uGrain, uGrain, random(sin(vUv) * uTime));
	color.rgb += grain;

	gl_FragColor.rgb = color;
	gl_FragColor.a = 1.;
}
`

const Background = (): JSX.Element => {
  const bg = useRef(null)

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
    }),
    []
  )

  useFrame((_, delta) => {
    if (bg.current) uniforms.uTime.value += delta
  })

  return (
    <mesh ref={bg} renderOrder={-1} frustumCulled={false}>
      <planeGeometry args={[2, 2, 1]} />
      <shaderMaterial
        depthWrite={false}
        uniforms={uniforms}
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
      />
    </mesh>
  )
}

export default Background
