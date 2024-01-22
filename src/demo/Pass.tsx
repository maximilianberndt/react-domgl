import { forwardRef } from 'react'

import { BlendFunction, Effect } from 'postprocessing'
import React from 'react'
import { Uniform } from 'three'

const fragmentShader = /* glsl */ `
    uniform float frequency;
    uniform float amplitude;
    uniform float time;
    uniform float blocksStrength;
    uniform float rotation;

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

    vec2 barrelPincushion(vec2 uv, float strength) {
      vec2 st = uv - 0.5;
      float theta = atan(st.x, st.y);
      float radius = sqrt(dot(st, st));
      radius *= 1.0 + strength * (radius * radius);
  
      return 0.5 + radius * vec2(sin(theta), cos(theta));
    }
    
    void mainUv(inout vec2 uv) {
      float d = distance(uv, vec2(0.5));
      
      uv = barrelPincushion(uv, rotation);
      uv = rotate(uv, d * rotation * 0.2);

      // float blocks = blocksStrength;
      // uv.y = fract(floor(blocks * uv.y) / blocks);//floor(uv.y * blocks) / blocks;

      uv.y += sin(uv.x * frequency) * amplitude;
    }

    void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
      outputColor = inputColor;
    }
`

class PassEffect extends Effect {
  constructor({
    frequency,
    amplitude,
    blocksStrength,
    rotation,
    blendFunction = BlendFunction.DARKEN,
  }) {
    super('PassEffect', fragmentShader, {
      blendFunction,
      uniforms: new Map([
        ['frequency', new Uniform(frequency)],
        ['amplitude', new Uniform(amplitude)],
        ['blocksStrength', new Uniform(blocksStrength)],
        ['rotation', new Uniform(rotation)],
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
    blocksStrength: 0,
    rotation: 0,
    blendFunction: BlendFunction.DARKEN,
    ...props,
  })

  return <primitive ref={ref} object={effect} />
})
