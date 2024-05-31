import { Mesh } from 'ogl'
import React, {
  ReactNode,
  RefObject,
  forwardRef,
  useEffect,
} from 'react'
import GlElement from './GlElement'
import useSyncDomGl from './hooks/useSyncDomGl'

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

    useEffect(() => {
      console.log(domRef)
    })

    return (
      <mesh
        {...rest}
        ref={(el: Mesh) => {
          sync(el)
          if (ref) ref.current = el
        }}
      >
        <plane />
        <normalProgram />
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
