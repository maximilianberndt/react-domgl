import React, { CSSProperties, useRef } from 'react'
import GlImage from '../components/GlImage'

const Image = ({
  src,
  style,
}: {
  src: string
  style: CSSProperties
}) => {
  const ref = useRef(null)

  return (
    <GlImage>
      <img ref={ref} src={src} style={style} />
    </GlImage>
  )
}

export default Image
