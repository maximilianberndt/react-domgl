import React, { useRef } from 'react'
import GlVideo from '../components/GlVideo'

const Video = ({ src }) => {
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
        style={{ width: '40vw', aspectRatio: '16 / 9' }}
        onClick={onClick}
      />
    </GlVideo>
  )
}

export default Video
