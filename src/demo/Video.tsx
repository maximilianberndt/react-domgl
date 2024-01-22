import React, { useRef } from 'react'
import GlVideo from '../components/GlVideo'

const Video = ({ src, style }) => {
  const ref = useRef<HTMLVideoElement>(null)

  const onClick = () => {
    const video = ref.current

    if (!video) return
    video.paused ? video.play() : video.pause()
  }

  return (
    <GlVideo onClick={onClick}>
      <video
        playsInline
        muted
        ref={ref}
        src={src}
        style={style}
        onClick={onClick}
      />
    </GlVideo>
  )
}

export default Video
