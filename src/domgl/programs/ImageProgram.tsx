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
  
        uniform vec2 uImageSizes;
        uniform vec2 uPlaneSizes;
        uniform highp sampler2D tMap;
  
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
      
          vec4 color = texture2D(tMap, uv); 
      
      
        gl_FragColor = color;
        }
      `
      }
      uniforms={{
        uPlaneSizes: { value: [1, 1] },
        uImageSizes: { value: [1, 1] },
        tMap: { value: texture },
      }}
      {...rest}
    />
  )
}

export default ImageProgram
