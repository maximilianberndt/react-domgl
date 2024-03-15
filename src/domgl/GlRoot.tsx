import { Canvas } from '@react-three/fiber'
import {
  ReactLenis,
  ReactLenisOptions,
} from '@studio-freight/react-lenis'
import React, { Suspense, useEffect, useRef } from 'react'
import GlCamera from './GlCamera'
import { glStore } from './utils/glStore'
import { glTunnel } from './utils/glTunnel'
import { loadingManager } from './utils/loadingManager'

interface GlRootProps {
  enabled?: boolean
  onLoad?: () => void
  onLoadingProgress?: (progress: number) => void
  children?: JSX.Element[] | JSX.Element
  camera?: Partial<{
    fov: number
    near: number
    far: number
    position: number[]
  }>
  lenis?: Partial<ReactLenisOptions>
}

const GlRoot = ({
  enabled = true,
  children,
  onLoad,
  onLoadingProgress,
  camera,
  lenis,
}: GlRootProps) => {
  const eventSource = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadingManager.onProgress = (_, itemsLoaded, itemsTotal) => {
      const loadingProgress = Math.round(itemsLoaded / itemsTotal)

      glStore.setState({ loadingProgress })
      if (onLoadingProgress) onLoadingProgress(loadingProgress)
    }
    loadingManager.onLoad = () => {
      glStore.setState({ loadingProgress: 1 })
      if (onLoad) onLoad()
    }
  }, [])

  if (!enabled) return <>{children}</>

  return (
    <div ref={eventSource}>
      <Suspense>
        <ReactLenis
          root
          options={{
            // gestureOrientation: 'both',
            smoothWheel: true,
            smoothTouch: true,
            wheelEventsTarget: document.body,
            syncTouch: true,
            ...lenis,
          }}
        >
          <Canvas
            flat
            linear
            eventSource={eventSource}
            camera={{ fov: 50, ...camera }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              height: '100vh',
              width: '100vw',
              zIndex: -1,
              pointerEvents: 'none',
            }}
            // camera={{manual: true}}
          >
            <GlCamera />
            <glTunnel.Out />
          </Canvas>

          {children}
        </ReactLenis>
      </Suspense>
    </div>
  )
}

export default GlRoot
