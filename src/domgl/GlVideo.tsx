import { Mesh, TextureLoader } from 'ogl'
import React, {
  Suspense,
  forwardRef,
  useCallback,
  type ReactNode,
  type RefObject,
} from 'react'
import { useFrame, useLoader } from 'react-ogl'
import GlElement from './GlElement'
import useSyncDomGl from './hooks/useSyncDomGl'
import ImageProgram from './programs/ImageProgram'
import { glStore } from './utils/glStore'

interface GlVideoProps {
  children: ReactNode
  domRef: RefObject<HTMLVideoElement>
  offsetX?: RefObject<number>
  offsetY?: RefObject<number>
}

const WebglVideo = forwardRef<Mesh, Omit<GlVideoProps, 'children'>>(
  ({ domRef, offsetX, offsetY, ...rest }, ref) => {
    const plane = glStore((s) => s.plane)

    const sync = useSyncDomGl(domRef, {
      syncScale: true,
      offsetX,
      offsetY,
    })

    const initRef = useCallback(
      (el: Mesh) => {
        if (!el) return

        sync(el)
        if (ref) ref.current = el
      },
      [sync]
    )

    const video = domRef?.current
    const texture = useLoader(TextureLoader, video!.src)

    useFrame(() => {
      if (!video) return

      // Attach video and/or update texture when video is ready
      if (video.readyState >= video.HAVE_ENOUGH_DATA) {
        if (!texture.image) texture.image = video
        texture.needsUpdate = true
      }
    })

    return (
      <mesh {...rest} ref={initRef} geometry={plane}>
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
