import { Text } from '@react-three/drei'
import React, { useEffect, useRef, useState } from 'react'
import useSceneSize from '../hooks/useSceneSize'
import useSyncDomGl from '../hooks/useSyncDomGl'
import { glTunnel } from './GlRoot'

const GlText = ({ children }) => {
  const { scaleFactor } = useSceneSize()
  const ref = useRef()
  const text = children?.ref?.current

  const [style, setStyle] = useState({})

  useSyncDomGl(ref.current, text)

  useEffect(() => {
    if (!text) return
    const s = getComputedStyle(text)

    setStyle({
      fontSize: parseFloat(s.fontSize) * scaleFactor.x,
      color: s.color,
      lineHeight:
        s.lineHeight === 'normal' ? 1.2 : parseFloat(s.lineHeight),
    })
  }, [text, scaleFactor])

  return (
    <>
      <glTunnel.In>
        <Text
          ref={ref}
          {...style}
          anchorX={'left'}
          anchorY={'middle'}
          //   color={'pink'}
        >
          {text?.innerText}
        </Text>
      </glTunnel.In>

      {children}
    </>
  )
}

export default GlText
