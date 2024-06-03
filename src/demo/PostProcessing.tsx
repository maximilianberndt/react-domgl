import { Post, Vec2 } from 'ogl'
import React, { useEffect, useRef } from 'react'
import { useFrame } from 'react-ogl'
import { useWindowSize } from 'usehooks-ts'

const fragment = /* glsl */ `
precision highp float;

uniform sampler2D tMap;
uniform vec2 uResolution;

varying vec2 vUv;

void main() {
	vec3 color = texture2D(tMap, vUv).rgb;

    // // Vignette Effect
    float distanceFromCenter = distance(vUv, vec2(0.5));
    color = (1. - distanceFromCenter * .2) * color;
	
	gl_FragColor.rgb = color;
	gl_FragColor.a = 1.0;
}
`

const PostProcessing = () => {
  const windowSize = useWindowSize()
  const resolutionRef = useRef({ value: new Vec2() })
  const postRef = useRef<Post>()

  useEffect(() => {
    const post = postRef.current
    const resolution = resolutionRef.current
    if (!post || !resolution) return

    post.addPass({
      fragment,
      uniforms: {
        uResolution: resolution,
      },
    })
  }, [])

  useFrame(({ scene, camera }) => {
    const post = postRef.current
    if (!post) return

    post.render({ scene, camera })
  }, Infinity)

  useEffect(() => {
    const post = postRef.current
    if (!post) return

    resolutionRef.current.value.set(
      windowSize.width,
      windowSize.height
    )

    post.resize()
  }, [windowSize])

  return <post ref={postRef} />
}

export default PostProcessing
