import React, { CSSProperties, ElementType, useRef } from 'react'
import GlText from '../domgl/GlText'

const Text = ({
  as: Tag = 'p',
  style,
  children,
  ...rest
}: {
  children: string
  style?: CSSProperties
  as?: ElementType
  [x: string]: any
}): JSX.Element => {
  const ref = useRef(null)

  return (
    <GlText domRef={ref}>
      <Tag ref={ref} {...rest} style={style}>
        {children}
      </Tag>
    </GlText>
  )
}

export default Text
