import { Canvas } from '@react-three/fiber'
import { ReactLenis } from '@studio-freight/react-lenis'
import React, { useEffect } from 'react'
import { LoadingManager } from 'three'
import { TextureLoader } from 'three/src/loaders/TextureLoader'
import tunnel from 'tunnel-rat'
import { create } from 'zustand'
import GlCamera from './GlCamera'
import PostProcessing, { PostProcessingProps } from './PostProcessing'

export const loadingManager = new LoadingManager()
export const textureLoader = new TextureLoader(loadingManager)
export const glTunnel = tunnel()

export const glStore = create(() => ({
  camera: null,
  loadingProgress: 0,
}))

interface GlRootProps extends PostProcessingProps {
  children: JSX.Element[] | JSX.Element
}

const GlRoot = ({
  children,
  passes = [],
  effectComposerProps,
}: GlRootProps) => {
  useEffect(() => {
    loadingManager.onProgress = (_, itemsLoaded, itemsTotal) => {
      glStore.setState({ loadingProgress: itemsLoaded / itemsTotal })
    }
    loadingManager.onLoad = () => {
      glStore.setState({ loadingProgress: 1 })
    }
  }, [])

  return (
    <ReactLenis
      root
      options={{
        // gestureOrientation: 'both',
        smoothWheel: true,
        smoothTouch: true,
        wheelEventsTarget: document.body,
        syncTouch: true,
      }}
    >
      <Canvas
        flat
        linear
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '100vh',
          width: '100vw',
        }}
        // camera={{manual: true}}
      >
        <GlCamera />
        <glTunnel.Out />

        <PostProcessing
          passes={passes}
          effectComposerProps={effectComposerProps}
        />
      </Canvas>

      {children}
    </ReactLenis>
  )
}

export default GlRoot
