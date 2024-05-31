import { Mesh, TextureLoader } from 'ogl'
import React, { ReactNode, RefObject, forwardRef } from 'react'
import { useLoader } from 'react-ogl'
import GlElement from './GlElement'
import useSyncDomGl from './hooks/useSyncDomGl'
import ImageProgram from './programs/ImageProgram'
import createTextureFromCanvas from './utils/createTexturefromCanvas'

interface GlTextProps {
  children: ReactNode
  domRef: RefObject<HTMLVideoElement>
  offsetX?: RefObject<number>
  offsetY?: RefObject<number>
}

const WebGlText = forwardRef<Mesh, Omit<GlTextProps, 'children'>>(
  ({ domRef, offsetX, offsetY, ...rest }, ref) => {
    const { sync } = useSyncDomGl(domRef, {
      syncScale: true,
      offsetX,
      offsetY,
    })

    const texture = useLoader(
      TextureLoader,
      createTextureFromCanvas(domRef)
    )

    return (
      <mesh
        {...rest}
        ref={(el: Mesh) => {
          sync(el)
          if (ref) ref.current = el
        }}
      >
        <plane />
        <ImageProgram texture={texture} />
      </mesh>
    )
  }
)

const GlText = forwardRef<Mesh, GlTextProps>(
  ({ children, ...props }, ref) => {
    return (
      <>
        <GlElement>
          <WebGlText {...props} ref={ref} />
        </GlElement>

        {children}
      </>
    )
  }
)

export default GlText
