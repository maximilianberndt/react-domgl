import { Camera, Flowmap, Plane } from 'ogl'
import { create } from 'zustand'

interface GlState {
  camera: Camera | null
  loadingProgress: number
  mouseFlow: Flowmap | null
  plane: Plane | null
}

export const glStore = create<GlState>(() => ({
  camera: null,
  mouseFlow: null,
  loadingProgress: 0,
  plane: null,
}))
