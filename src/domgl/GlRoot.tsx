import { LenisOptions } from 'lenis'
import { ReactLenis } from 'lenis/react'
import React, { Suspense } from 'react'
import { Canvas } from 'react-ogl'
import GlCamera from './GlCamera'
import events from './utils/events'
import { glTunnel } from './utils/glTunnel'

interface GlRootProps {
  enabled?: boolean
  // onLoad?: () => void
  // onLoadingProgress?: (progress: number) => void
  children: JSX.Element[] | JSX.Element
  // camera?: Partial<{
  //   fov: number
  //   near: number
  //   far: number
  //   position: number[]
  // }>
  lenis?: Partial<LenisOptions>
}

const GlRoot = ({
  enabled = true,
  children,
  lenis = {},
}: // onLoad,
// onLoadingProgress,
// camera,
// lenis,
GlRootProps) => {
  // const eventSource = useRef<HTMLDivElement>(null)

  // useEffect(() => {
  //   loadingManager.onProgress = (_, itemsLoaded, itemsTotal) => {
  //     const loadingProgress = Math.round(itemsLoaded / itemsTotal)

  //     glStore.setState({ loadingProgress })
  //     if (onLoadingProgress) onLoadingProgress(loadingProgress)
  //   }
  //   loadingManager.onLoad = () => {
  //     glStore.setState({ loadingProgress: 1 })
  //     if (onLoad) onLoad()
  //   }
  // }, [])

  if (!enabled) return <ReactLenis root>{children}</ReactLenis>

  return (
    // <div ref={eventSource}>
    <Suspense>
      <ReactLenis
        root
        options={{
          // gestureOrientation: 'both',
          // smoothWheel: true,
          // smoothTouch: true,
          // wheelEventsTarget: document.body,
          // syncTouch: true,
          ...lenis,
        }}
      >
        <Canvas
          // eventSource={eventSource}
          events={events}
          camera={{ fov: 50, position: [0, 0, 5] }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            height: '100vh',
            width: '100vw',
            zIndex: -1,
            // pointerEvents: 'none',
          }}
        >
          <GlCamera />
          <glTunnel.Out />
        </Canvas>

        {children}
      </ReactLenis>
    </Suspense>
    // </div>
  )
}

export default GlRoot
