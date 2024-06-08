import { Flowmap, Program, Vec2, type OGLRenderingContext } from 'ogl'
import React, { useEffect, useRef } from 'react'
import { useFrame, useOGL } from 'react-ogl'
import { glStore } from './utils/glStore'

const vertex = /* glsl */ `
attribute vec2 uv;
attribute vec2 position;

varying vec2 vUv;

void main() {
    vUv = uv;
    gl_Position = vec4(position - vec2(0.75, 0.75), 0, 1);
}
`

const fragment = /* glsl */ `
precision highp float;

uniform sampler2D tFlow;
uniform float uTime;

varying vec2 vUv;

void main() {
    // R and G values are velocity in the x and y direction
    // B value is the velocity length
    vec3 flow = texture2D(tFlow, vUv).rgb;

    // // Oscillate between raw values and the affected texture above
    // tex = mix(tex, flow * 0.5 + 0.5, smoothstep(-0.3, 0.7, sin(uTime)));

    gl_FragColor.rgb = flow;
    gl_FragColor.a = 1.0;
}
`

// Variable inputs to control flowmap
let aspect = 1
const mouse = new Vec2(-1)
const lastMouse = new Vec2()
const velocity = new Vec2()
let lastTime = 0

const updateMouse =
  (gl: OGLRenderingContext) =>
  (e: MouseEventInit | TouchEventInit) => {
    const x = e.changedTouches?.[0].pageX || e.clientX
    const y = e.changedTouches?.[0].pageY || e.clientY

    // Get mouse value in 0 to 1 range, with y flipped
    mouse.set(x / gl.renderer.width, 1.0 - y / gl.renderer.height)

    // Calculate velocity
    if (!lastTime) {
      // First frame
      lastTime = performance.now()
      lastMouse.set(x, y)
    }

    const deltaX = x - lastMouse.x
    const deltaY = y - lastMouse.y

    lastMouse.set(x, y)

    let time = performance.now()

    // Avoid dividing by 0
    let delta = Math.max(14, time - lastTime)
    lastTime = time

    velocity.x = deltaX / delta
    velocity.y = deltaY / delta

    // Flag update to prevent hanging velocity values when not moving
    velocity.needsUpdate = true
  }

const MouseFlow = ({ debug }: { debug?: boolean }) => {
  const flow = useRef<Flowmap>()
  const program = useRef<Program>()
  const gl = useOGL((s) => s.gl)

  useFrame(({}, t) => {
    const flowmap = flow.current
    if (!flowmap) return

    // Reset velocity when mouse not moving
    if (!velocity.needsUpdate) {
      mouse.set(-1)
      velocity.set(0)
    }
    velocity.needsUpdate = false

    // Update flowmap inputs
    flowmap.aspect = aspect
    flowmap.mouse.copy(mouse)

    // Ease velocity input, slower when fading out
    flowmap.velocity.lerp(velocity, velocity.len() ? 0.5 : 0.1)

    flowmap.update()

    if (!program.current) return
    program.current.uniforms.uTime.value = t * 0.001
  })

  useEffect(() => {
    if (!flow.current) return

    if (program.current) {
      program.current.uniforms.tFlow.value = flow.current.uniform
    }

    glStore.setState({ mouseFlow: flow.current })

    return () => {
      glStore.setState({ mouseFlow: null })
    }
  }, [debug])

  useEffect(() => {
    const _updateMouse = updateMouse(gl)

    window.addEventListener('touchstart', _updateMouse, false)
    window.addEventListener('touchmove', _updateMouse, false)
    window.addEventListener('mousemove', _updateMouse, false)

    return () => {
      window.removeEventListener('touchstart', _updateMouse, false)
      window.removeEventListener('touchmove', _updateMouse, false)
      window.removeEventListener('mousemove', _updateMouse, false)
    }
  }, [gl])

  return (
    <>
      <flowmap ref={flow} />

      {debug && (
        <mesh frustumCulled={false} position={[-1, 1, 0]}>
          <plane args={[{ width: 0.5, height: 0.5 }]} />
          <program
            ref={program}
            vertex={vertex}
            fragment={fragment}
            uniforms={{
              uTime: { value: 0 },
              tFlow: { value: {} },
            }}
          />
        </mesh>
      )}
    </>
  )
}

export default MouseFlow
