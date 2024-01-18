import { forwardRef } from 'react'

import { BlendFunction, Effect } from 'postprocessing'
import React from 'react'
import { Uniform } from 'three'

const fragmentShader = /* glsl */ `
    uniform float frequency;
    uniform float amplitude;
    uniform float time;
    
    void mainUv(inout vec2 uv)
    {
        uv.y += sin(uv.x * frequency + time) * amplitude;
    }

    void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor)
    {
        outputColor = inputColor;
    }
`

class PassEffect extends Effect {
  constructor({
    frequency,
    amplitude,
    blendFunction = BlendFunction.DARKEN,
  }) {
    super('PassEffect', fragmentShader, {
      blendFunction,
      uniforms: new Map([
        ['frequency', new Uniform(frequency)],
        ['amplitude', new Uniform(amplitude)],
        ['time', new Uniform(0)],
      ]),
    })
  }

  update(renderer, inputBuffer, deltaTime) {
    this.uniforms.get('time')!.value += deltaTime
  }
}

export default forwardRef(function Pass(props, ref) {
  const effect = new PassEffect({
    frequency: 2,
    amplitude: 0.1,
    blendFunction: BlendFunction.DARKEN,
    ...props,
  })

  return <primitive ref={ref} object={effect} />
})
