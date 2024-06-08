import { Mesh } from 'ogl'
import { useCallback, useEffect, useRef, type RefObject } from 'react'
// import useResizeObserver from 'use-resize-observer'
import { useLenis } from 'lenis/react'
import { useFrame } from 'react-ogl'
import { glStore } from '../utils/glStore'
import useSceneSize, {
  type ScaleFactor,
  type Size,
} from './useSceneSize'

const updateX = (
  plane: Mesh,
  offset = 0,
  bounds: DOMRect,
  scaleFactor: ScaleFactor,
  sceneSize: Size
) => {
  const x = bounds.left - offset
  const sceneOffset = -sceneSize.width * 0.5 + plane.scale.x * 0.5

  plane.position.x = sceneOffset + x * scaleFactor.x
}

const updateY = (
  plane: Mesh,
  offset = 0,
  bounds: DOMRect,
  scaleFactor: ScaleFactor,
  sceneSize: Size
) => {
  const y = bounds.top - offset
  const sceneOffset = sceneSize.height * 0.5 - plane.scale.y * 0.5

  plane.position.y = sceneOffset - y * scaleFactor.y
}

const updateScale = (
  plane: Mesh,
  bounds: DOMRect,
  scaleFactor: ScaleFactor
) => {
  plane.scale.x = bounds.width * scaleFactor.x
  plane.scale.y = bounds.height * scaleFactor.y
}

type UpdateProps = {
  offsetX: RefObject<number>
  offsetY: RefObject<number>
  scaleFactor: ScaleFactor
  sceneSize: Size
  syncScale: boolean
  bounds: DOMRect
}

const update = (
  mesh: Mesh,
  {
    offsetX,
    offsetY,
    scaleFactor,
    sceneSize,
    syncScale,
    bounds,
  }: UpdateProps
) => {
  syncScale && updateScale(mesh, bounds, scaleFactor)
  updateX(mesh, offsetX.current || 0, bounds, scaleFactor, sceneSize)
  updateY(mesh, offsetY.current || 0, bounds, scaleFactor, sceneSize)
}

type SyncOptions = {
  syncScale?: boolean
  offsetX: RefObject<number>
  offsetY: RefObject<number>
}

const hideDomElement = (element: HTMLElement) => {
  const isPlane = { IMG: true, VIDEO: true }[element.nodeName]

  if (isPlane) {
    element.style.visibility = 'hidden'
  } else {
    // isText
    element.style.color = 'transparent'
  }
}

const useSyncDomGl = (
  domElementRef: RefObject<HTMLElement>,
  {
    syncScale = false,
    offsetX = { current: 0 },
    offsetY = { current: 0 },
  }: Partial<SyncOptions> = {}
) => {
  const meshRef = useRef<Mesh>()
  const boundsRef = useRef<DOMRect>()
  const { scaleFactor, sceneSize } = useSceneSize()
  const windowSize = glStore((s) => s.windowSize)

  const lenis = useLenis()

  const updateBounds = useCallback(() => {
    if (!domElementRef.current) return
    const bounds = domElementRef.current.getBoundingClientRect()

    boundsRef.current = {
      top: bounds.top + lenis.scroll,
      left: bounds.left,
      width: bounds.width,
      height: bounds.height,
    }
  }, [])

  const sync = useCallback((mesh: Mesh) => {
    if (!domElementRef.current || !mesh) return
    meshRef.current = mesh
    hideDomElement(domElementRef.current)
  }, [])

  useEffect(() => {
    updateBounds(meshRef.current)
  }, [windowSize.height, windowSize.width, updateBounds])

  useFrame(() => {
    const mesh = meshRef.current
    const bounds = boundsRef.current
    if (!mesh || !bounds) return

    update(mesh, {
      offsetX,
      offsetY,
      scaleFactor,
      sceneSize,
      syncScale,
      bounds,
    })
  })

  return sync
}

export default useSyncDomGl
