import React, { useRef } from 'react'
import GlText from '../components/GlText'

const Text = ({
  children,
  ...rest
}: {
  children: string
  [x: string]: any
}): JSX.Element => {
  const ref = useRef(null)

  return (
    <GlText font={'/Inter-Medium.ttf'}>
      <p ref={ref} {...rest}>
        {children}
      </p>
    </GlText>
  )
}

export default Text
