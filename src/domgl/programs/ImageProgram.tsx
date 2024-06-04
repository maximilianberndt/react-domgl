import React from 'react'

const ImageProgram = ({ texture, ...rest }) => {
  return (
    <program
      vertex={
        /* GLSL */ `
        attribute vec3 position;
        attribute vec2 uv;
  
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
  
        varying vec2 vUv;
  
        void main() {
          vUv = uv;
  
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `
      }
      fragment={
        /* GLSL */ `
        precision highp float;

        uniform highp sampler2D tMap;
  
        varying vec2 vUv;
  
        void main() {      
          vec4 color = texture2D(tMap, vUv); 
          gl_FragColor = color;
        }
      `
      }
      uniforms={{
        tMap: { value: texture },
      }}
      {...rest}
    />
  )
}

export default ImageProgram
