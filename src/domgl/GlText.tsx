import { Mesh } from 'ogl'
import {
  Suspense,
  forwardRef,
  useCallback,
  useMemo,
  type ReactNode,
  type RefObject,
} from 'react'
import { useOGL } from 'react-ogl'
import GlElement from './GlElement'
import useSyncDomGl from './hooks/useSyncDomGl'
import ImageProgram from './programs/ImageProgram'
import createTextureFromCanvas from './utils/createTexturefromCanvas'
import { glStore } from './utils/glStore'

interface GlTextProps {
  children: ReactNode
  domRef: RefObject<HTMLVideoElement>
  offsetX?: RefObject<number>
  offsetY?: RefObject<number>
}

const WebGlText = forwardRef<Mesh, Omit<GlTextProps, 'children'>>(
  ({ domRef, offsetX, offsetY, ...rest }, ref) => {
    const { gl } = useOGL()
    const plane = glStore((s) => s.plane)

    const sync = useSyncDomGl(domRef, {
      syncScale: true,
      offsetX,
      offsetY,
    })

    const initRef = useCallback(
      (el: Mesh) => {
        sync(el)
        if (ref) ref.current = el
      },
      [sync]
    )

    const texture = useMemo(
      () => createTextureFromCanvas(domRef, gl),
      [gl, domRef]
    )

    return (
      <mesh {...rest} ref={initRef} geometry={plane}>
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
