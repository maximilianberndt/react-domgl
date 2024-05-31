import { Mesh, TextureLoader } from 'ogl'
import React, {
  ReactNode,
  RefObject,
  Suspense,
  forwardRef,
} from 'react'
import { useLoader } from 'react-ogl'
import GlElement from './GlElement'
import useSyncDomGl from './hooks/useSyncDomGl.js'
import ImageProgram from './programs/ImageProgram'

// interface GlImageProps extends MeshProps {
interface GlImageProps {
  children: ReactNode
  domRef: RefObject<HTMLImageElement>
  offsetX?: RefObject<number>
  offsetY?: RefObject<number>
}

const WebglImage = forwardRef<Mesh, Omit<GlImageProps, 'children'>>(
  ({ domRef, offsetX, offsetY, ...rest }, ref) => {
    const { sync } = useSyncDomGl(domRef, {
      syncScale: true,
      offsetX,
      offsetY,
    })

    const image = domRef?.current
    const src = image?.currentSrc || image?.src

    const texture = useLoader(TextureLoader, src)

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

const GlImage = forwardRef<Mesh, GlImageProps>(
  ({ children, ...props }, ref) => {
    return (
      <>
        <GlElement>
          <Suspense>
            <WebglImage {...props} ref={ref} />
          </Suspense>
        </GlElement>

        {children}
      </>
    )
  }
)

export default GlImage
