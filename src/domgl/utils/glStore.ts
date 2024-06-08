import { Camera, Flowmap, Plane } from 'ogl'
import { create } from 'zustand'

interface GlState {
  camera: Camera | null
  loadingProgress: number
  mouseFlow: Flowmap | null
  plane: Plane | null
  windowSize: { width: number; height: number }
  resize: () => void
}

export const glStore = create<GlState>((set, get) => {
  const resize = () => {
    set({
      windowSize: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
    })
  }

  if (typeof window !== 'undefined') {
    window.addEventListener('resize', resize)
  }

  return {
    camera: null,
    mouseFlow: null,
    loadingProgress: 0,
    plane: null,
    windowSize: { width: 0, height: 0 },
    resize,
  }
})
