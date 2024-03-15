import { useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { loadingManager } from '../utils/loadingManager'

export const useGltfLoader = (src = '') =>
  useLoader(GLTFLoader, src, (loader) => {
    loader.manager = loadingManager
  })
