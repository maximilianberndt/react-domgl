import { Mesh, TextureLoader } from 'ogl'
import React, {
  ReactNode,
  RefObject,
  Suspense,
  forwardRef,
} from 'react'
import { useFrame, useLoader } from 'react-ogl'
import GlElement from './GlElement'
import useSyncDomGl from './hooks/useSyncDomGl'
import ImageProgram from './programs/ImageProgram'

interface GlVideoProps {
  children: ReactNode
  domRef: RefObject<HTMLVideoElement>
  offsetX?: RefObject<number>
  offsetY?: RefObject<number>
}

const WebglVideo = forwardRef<Mesh, Omit<GlVideoProps, 'children'>>(
  ({ domRef, offsetX, offsetY, ...rest }, ref) => {
    const { sync } = useSyncDomGl(domRef, {
      syncScale: true,
      offsetX,
      offsetY,
    })
    const video = domRef?.current

    const texture = useLoader(TextureLoader, video.src)

    useFrame(() => {
      if (!video) return

      // Attach video and/or update texture when video is ready
      if (video.readyState >= video.HAVE_ENOUGH_DATA) {
        if (!texture.image) texture.image = video
        texture.needsUpdate = true
      }
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
        <ImageProgram texture={texture} />
      </mesh>
    )
  }
)

const GlVideo = forwardRef<Mesh, GlVideoProps>(
  ({ children, ...props }, ref) => {
    return (
      <>
        <GlElement>
          <Suspense>
            <WebglVideo {...props} ref={ref} />
          </Suspense>
        </GlElement>

        {children}
      </>
    )
  }
)

export default GlVideo
