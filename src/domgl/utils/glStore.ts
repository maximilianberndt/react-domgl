import { Camera, Flowmap } from 'ogl'
import { create } from 'zustand'

interface GlState {
  camera: Camera | null
  loadingProgress: number
  mouseFlow?: Flowmap | null
}

export const glStore = create<GlState>(() => ({
  camera: null,
  mouseFlow: null,
  loadingProgress: 0,
}))
