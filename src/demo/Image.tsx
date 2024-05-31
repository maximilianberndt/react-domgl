import { Mesh } from 'ogl'
import React, { CSSProperties, useRef } from 'react'
import GlImage from '../domgl/GlImage'

const Image = ({
  src,
  style,
}: {
  src: string
  style: CSSProperties
}) => {
  const glRef = useRef<Mesh>(null)
  const domRef = useRef<HTMLImageElement>(null)

  return (
    <GlImage ref={glRef} domRef={domRef}>
      <img ref={domRef} src={src} style={style} />
    </GlImage>
  )
}

export default Image
