import React, { CSSProperties, useRef } from 'react'
import { BufferGeometry } from 'three'
import GlImage from '../components/GlImage'

const Image = ({
  src,
  style,
  geometry,
}: {
  src: string
  style: CSSProperties
  geometry?: BufferGeometry
}) => {
  const ref = useRef(null)

  return (
    <GlImage geometry={geometry}>
      <img ref={ref} src={src} style={style} />
    </GlImage>
  )
}

export default Image
