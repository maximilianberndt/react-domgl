import React, { useMemo, useRef } from 'react'
import GlText from '../components/GlText'

const Text = ({
  as = 'p',
  children,
  ...rest
}: {
  as: string
  children: string
  [x: string]: any
}): JSX.Element => {
  const ref = useRef(null)

  const Tag = useMemo(() => as, [as])

  return (
    <GlText font={'/Inter-Medium.ttf'}>
      <Tag ref={ref} {...rest}>
        {children}
      </Tag>
    </GlText>
  )
}

export default Text
