import { Color } from 'ogl'
import React, { useRef } from 'react'
import { useFrame } from 'react-ogl'

const vertex = /* glsl */ `
attribute vec2 uv;
attribute vec2 position;

varying vec2 vUv;

void main() {
    vUv = uv;
    gl_Position = vec4(position, 0, 1);
}
`

const fragment = /* glsl */ `
precision highp float;

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

const Program = () => {
  const ref = useRef(null)

  useFrame((_, t) => {
    if (ref.current) ref.current.uniforms.uTime.value = t * 0.0001
  })

  return (
    <program
      ref={ref}
      depthWrite={false}
      uniforms={{
        uTime: { value: 0 },
        uColor: { value: new Color(0.3, 0.2, 0.5) },
      }}
      vertex={vertex}
      fragment={fragment}
    />
  )
}

const Background = (): JSX.Element => {
  return (
    <mesh frustumCulled={false}>
      <plane args={[{ width: 2, height: 2 }]} />
      <Program />
    </mesh>
  )
}

export default Background
