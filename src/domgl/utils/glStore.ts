import { Camera } from 'ogl'
import { create } from 'zustand'

interface GlState {
  camera: Camera | null
  loadingProgress: number
}

export const glStore = create<GlState>(() => ({
  camera: null,
  loadingProgress: 0,
}))
