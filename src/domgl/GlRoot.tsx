import { LenisOptions } from 'lenis'
import { ReactLenis } from 'lenis/react'
import React, { Suspense } from 'react'
import { Canvas, RenderProps } from 'react-ogl'
import GlCamera from './GlCamera'
import events from './utils/events'
import { glTunnel } from './utils/glTunnel'

type GlRootProps = {
  enabled?: boolean
  // onLoad?: () => void
  // onLoadingProgress?: (progress: number) => void
  children: JSX.Element[] | JSX.Element
  lenisOptions?: Partial<LenisOptions>
  onCreated?: RenderProps['onCreated']
  renderer?: RenderProps['renderer']
  camera?: RenderProps['camera']
} & RenderProps

const GlRoot = ({
  enabled = true,
  children,
  lenisOptions = {},
  camera = { fov: 50, position: [0, 0, 5] },
  dpr = [1, 2],
  ...renderProps
}: // onLoad,
GlRootProps) => {
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
    <ReactLenis
      root
      options={{
        // gestureOrientation: 'both',
        // smoothWheel: true,
        // smoothTouch: true,
        // wheelEventsTarget: document.body,
        // syncTouch: true,
        ...lenisOptions,
      }}
    >
      <Suspense>
        <Canvas
          {...renderProps}
          dpr={dpr}
          camera={camera}
          events={events}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            height: '100vh',
            width: '100vw',
            zIndex: -1,
          }}
        >
          <GlCamera />
          <glTunnel.Out />
        </Canvas>
      </Suspense>

      {children}
    </ReactLenis>
  )
}

export default GlRoot
