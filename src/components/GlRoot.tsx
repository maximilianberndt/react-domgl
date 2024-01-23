import { Canvas, useLoader } from '@react-three/fiber'
import { ReactLenis } from '@studio-freight/react-lenis'
import React, { useEffect, useRef } from 'react'
import { Camera, LoadingManager, PlaneGeometry } from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { TextureLoader } from 'three/src/loaders/TextureLoader'
import tunnel from 'tunnel-rat'
import { create } from 'zustand'
import GlCamera from './GlCamera'
import PostProcessing, { PostProcessingProps } from './PostProcessing'

export const loadingManager = new LoadingManager()
export const textureLoader = new TextureLoader(loadingManager)
export const plane = new PlaneGeometry()
export const glTunnel = tunnel()

export const useGltfLoader = (src = '') =>
  useLoader(GLTFLoader, src, (loader) => {
    loader.manager = loadingManager
  })

interface GlState {
  camera: Camera | null
  loadingProgress: number
}

export const glStore = create<GlState>(() => ({
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
  const eventSource = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadingManager.onProgress = (_, itemsLoaded, itemsTotal) => {
      console.log(itemsLoaded, itemsTotal)
      glStore.setState({ loadingProgress: itemsLoaded / itemsTotal })
    }
    loadingManager.onLoad = () => {
      glStore.setState({ loadingProgress: 1 })
    }
  }, [])

  return (
    <div ref={eventSource}>
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
          eventSource={eventSource}
          camera={{ fov: 50 }}
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

          <PostProcessing
            passes={passes}
            effectComposerProps={effectComposerProps}
          />
        </Canvas>

        {children}
      </ReactLenis>
    </div>
  )
}

export default GlRoot
