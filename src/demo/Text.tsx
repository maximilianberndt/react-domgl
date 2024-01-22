import React, { CSSProperties, useMemo, useRef } from 'react'
import GlText from '../components/GlText'

const Text = ({
  as = 'p',
  style,
  children,
  ...rest
}: {
  children: string
  style?: CSSProperties
  as?: string
  [x: string]: any
}): JSX.Element => {
  const ref = useRef(null)

  const Tag = useMemo(() => as, [as])

  return (
    <GlText font={'/Inter-Medium.ttf'}>
      <Tag ref={ref} {...rest} style={style}>
        {children}
      </Tag>
    </GlText>
  )
}

export default Text
