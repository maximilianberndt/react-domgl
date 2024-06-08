import { Mesh, Program, TextureLoader, type MeshOptions } from 'ogl'
import React, {
  Suspense,
  forwardRef,
  useCallback,
  useMemo,
  type ReactNode,
  type RefObject,
} from 'react'
import { useLoader } from 'react-ogl'
import GlElement from './GlElement'
import useSyncDomGl from './hooks/useSyncDomGl.js'
import ImageProgram from './programs/ImageProgram'
import { glStore } from './utils/glStore'

// interface GlImageProps extends MeshProps {
interface GlImageProps
  extends Pick<
    MeshOptions,
    'frustumCulled' | 'renderOrder' | 'mode'
  > {
  children: ReactNode
  program?: ({ texture }: { texture: any }) => Program
  domRef: RefObject<HTMLImageElement>
  offsetX?: RefObject<number>
  offsetY?: RefObject<number>
}

const WebglImage = forwardRef<Mesh, Omit<GlImageProps, 'children'>>(
  (
    { domRef, offsetX, offsetY, program: CustomProgram, ...rest },
    ref
  ) => {
    const plane = glStore((s) => s.plane)

    const sync = useSyncDomGl(domRef, {
      syncScale: true,
      offsetX,
      offsetY,
    })

    const src = useMemo(() => {
      const image = domRef?.current
      return image?.currentSrc || image?.src
    }, [domRef])

    const texture = useLoader(TextureLoader, src)

    const initRef = useCallback(
      (mesh: Mesh) => {
        if (!mesh) return

        sync(mesh)
        if (ref) ref.current = mesh
      },
      [sync]
    )

    return (
      <mesh {...rest} ref={initRef} geometry={plane}>
        {CustomProgram ? (
          <CustomProgram texture={texture} />
        ) : (
          <ImageProgram texture={texture} />
        )}
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
