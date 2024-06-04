import { Post, Vec2 } from 'ogl'
import React, { useEffect, useRef } from 'react'
import { useFrame } from 'react-ogl'
import { useWindowSize } from 'usehooks-ts'
import { glStore } from '../domgl/utils/glStore'
import postFrag from './postFrag'

const PostProcessing = () => {
  const windowSize = useWindowSize()
  const resolutionRef = useRef({ value: new Vec2() })
  const postRef = useRef<Post>()
  const mouseFlow = glStore((s) => s.mouseFlow)

  useEffect(() => {
    const post = postRef.current
    const resolution = resolutionRef.current
    if (!post || !resolution || !mouseFlow) return

    post.addPass({
      fragment: postFrag,
      uniforms: {
        uResolution: resolution,
        tFlow: mouseFlow.uniform,
      },
    })
  }, [mouseFlow])

  useFrame(({ scene, camera }) => {
    const post = postRef.current
    if (!post) return

    post.render({ scene, camera })
  }, -Infinity)

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
