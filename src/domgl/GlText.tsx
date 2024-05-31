import { Mesh } from 'ogl'
import React, {
  ReactNode,
  RefObject,
  Suspense,
  forwardRef,
  useMemo,
} from 'react'
import { useOGL } from 'react-ogl'
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
    const { gl } = useOGL()
    const { sync } = useSyncDomGl(domRef, {
      syncScale: true,
      offsetX,
      offsetY,
    })

    const texture = useMemo(
      () => createTextureFromCanvas(domRef, gl),
      [gl, domRef]
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
        <ImageProgram texture={texture} transparent={true} />
      </mesh>
    )
  }
)

const GlText = forwardRef<Mesh, GlTextProps>(
  ({ children, ...props }, ref) => {
    return (
      <>
        <GlElement>
          <Suspense>
            <WebGlText {...props} ref={ref} />
          </Suspense>
        </GlElement>

        {children}
      </>
    )
  }
)

export default GlText
