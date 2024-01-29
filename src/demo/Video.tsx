import React, { useRef } from 'react'
import GlVideo from '../components/GlVideo'
import { useIntersection } from '../utils/intersectionObserver'

const Video = ({ src, style }) => {
  const ref = useRef<HTMLVideoElement>(null)
  useIntersection(ref, {
    onEnter: () => {
      const video = ref.current
      if (video) video.play()
    },
    onLeave: () => {
      const video = ref.current
      if (video) video.play()
    },
  })

  return (
    <GlVideo domRef={ref}>
      <video playsInline muted ref={ref} src={src} style={style} />
    </GlVideo>
  )
}

export default Video
