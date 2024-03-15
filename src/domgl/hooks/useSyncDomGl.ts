import { useLenis } from '@studio-freight/react-lenis'
import { useRef } from 'react'
import { Mesh } from 'three'
// import useResizeObserver from 'use-resize-observer'
import useSceneSize, { ScaleFactor, Size } from './useSceneSize'

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

const resize = (
  mesh: Mesh,
  domElement: HTMLElement,
  { offsetX, offsetY, scaleFactor, sceneSize, lenis, syncScale }
) => {
  if (!domElement || !mesh) return
  const isPlane = { IMG: true, VIDEO: true }[domElement.nodeName]

  if (isPlane) {
    domElement.style.visibility = 'hidden'
  } else {
    // isText
    domElement.style.color = 'transparent'
  }
  const bounds = domElement.getBoundingClientRect()

  // TODO: The scrollbar is fucking up the size calculation
  // So the webgl element is slightly smaller
  syncScale && updateScale(mesh, bounds, scaleFactor)
  updateX(mesh, offsetX.current, bounds, scaleFactor, sceneSize)
  updateY(
    mesh,
    -lenis.scroll + offsetY.current,
    bounds,
    scaleFactor,
    sceneSize
  )

  // Update uniforms automatically
  if (
    mesh.material?.uniforms?.uPlaneSizes &&
    mesh.material?.uniforms?.uImageSizes
  ) {
    mesh.material.uniforms.uPlaneSizes.value = mesh.scale
    mesh.material.uniforms.uImageSizes.value = [
      bounds.width,
      bounds.height,
    ]
  }
}

type SyncOptions = {
  syncScale?: boolean
  offsetX: { current: number }
  offsetY: { current: number }
}

const useSyncDomGl = (
  domElement: HTMLElement,
  {
    syncScale = false,
    offsetX = { current: 0 },
    offsetY = { current: 0 },
  }: Partial<SyncOptions> = {}
) => {
  const glElement = useRef<Mesh>(null)
  const { scaleFactor, sceneSize } = useSceneSize()
  const lenis = useLenis()

  // TODO: debounce sync
  const sync = (mesh: Mesh) => {
    if (!mesh) return
    glElement.current = mesh

    resize(mesh, domElement, {
      offsetX,
      offsetY,
      scaleFactor,
      sceneSize,
      lenis,
      syncScale,
    })
  }

  // TODO: Do we need resize observer?
  // const { ref } = useResizeObserver<HTMLElement>({ onResize: resize })

  // useEffect(() => {
  //   ref(domElement)
  // }, [domElement])

  return { sync, ref: glElement }
}

export default useSyncDomGl
