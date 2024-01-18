import React, { useRef } from 'react'
import GlText from '../components/GlText'

const Text = ({ children }: { children: string }): JSX.Element => {
  const ref = useRef(null)

  return (
    <GlText font={'/Inter-Medium.ttf'}>
      <p
        ref={ref}
        style={{
          fontSize: '20vw',
          position: 'absolute',
          top: '300px',
          left: '200px',
        }}
      >
        {children}
      </p>
    </GlText>
  )
}

export default Text
