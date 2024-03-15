import { Text } from '@react-three/drei'
import React, { useEffect, useState } from 'react'
import GlElement from './GlElement'
import useSceneSize from './hooks/useSceneSize'
import useSyncDomGl from './hooks/useSyncDomGl'

const GlText = ({ children, font }) => {
  const { scaleFactor } = useSceneSize()
  const text = children?.ref?.current

  // const shaderProps = useMemo(
  //   () => ({
  //     uniforms: {
  //       uColor: { value: new Color('pink') },
  //     },
  //     vertexShader,
  //     fragmentShader,
  //   }),
  //   []
  // )

  const [style, setStyle] = useState({})

  const { sync, ref } = useSyncDomGl(text)

  useEffect(() => {
    if (!text) return
    const s = getComputedStyle(text)

    const fontSize = parseFloat(s.fontSize)
    const lineHeight =
      s.lineHeight === 'normal' ? 1.2 : parseFloat(s.lineHeight)

    setStyle({
      fontSize: fontSize * scaleFactor.x,
      maxWidth: parseFloat(s.width) * scaleFactor.x,
      lineHeight: lineHeight < 2 ? lineHeight : lineHeight / fontSize,
      fontWeight:
        { normal: 'nomal', bold: 'bold' }[s.fontWeight] ||
        parseFloat(s.fontWeight),
      color: s.color,
      fontStyle: s.fontStyle,
      textAlign: s.textAlign,
      fontFamily: s.fontFamily,
    })
  }, [text, scaleFactor])

  return (
    <>
      <GlElement>
        <Text
          ref={sync}
          {...style}
          // TODO: this might need to be adjustable per font
          anchorX={0.5}
          anchorY={-0.485}
          overflowWrap="break-word"
          font={font}
        >
          {text?.innerText}
          {/* <shaderMaterial {...shaderProps} /> */}
        </Text>
      </GlElement>

      {children}
    </>
  )
}

export default GlText
