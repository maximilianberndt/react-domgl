import React, { useRef } from 'react'
import GlImage from '../components/GlImage'

const Image = ({ src }: { src: string }) => {
  const ref = useRef(null)

  return (
    <GlImage>
      <img
        ref={ref}
        src={src}
        style={{
          width: '30vw',
          marginTop: '10%',
          marginLeft: '10%',
          aspectRatio: '1 / 1',
        }}
      />
    </GlImage>
  )
}

export default Image
