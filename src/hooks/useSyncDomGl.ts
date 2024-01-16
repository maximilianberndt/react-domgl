import { useLenis } from '@studio-freight/react-lenis'
import { useEffect } from 'react'
import { Mesh } from 'three'
import useSceneSize, { ScaleFactor } from './useSceneSize'

const updateX = (
  plane: Mesh,
  offset = 0,
  bounds: DOMRect,
  scaleFactor: ScaleFactor,
  sceneSize
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
  sceneSize
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

type SyncOptions = {
  syncScale?: boolean
  offsetX: { current: number }
  offsetY: { current: number }
}

const useSyncDomGl = (
  glElement: Mesh,
  domElement: HTMLElement,
  {
    syncScale = false,
    offsetX = { current: 0 },
    offsetY = { current: 0 },
  }: SyncOptions = {}
) => {
  const { scaleFactor, sceneSize } = useSceneSize()
  const lenis = useLenis()

  useEffect(() => {
    if (!domElement || !glElement) return
    const isPlane = { IMG: true, VIDEO: true }[domElement.nodeName]

    if (isPlane) {
      domElement.style.visibility = 'hidden'
    } else {
      // isText
      // domElement.style.color = 'transparent'
    }
    const bounds = domElement.getBoundingClientRect()

    // TODO: The scrollbar is fucking up the size calculation
    // So the webgl element is slightly smaller
    syncScale && updateScale(glElement, bounds, scaleFactor)
    updateX(
      glElement,
      offsetX.current,
      bounds,
      scaleFactor,
      sceneSize
    )
    updateY(
      glElement,
      -lenis.scroll + offsetY.current,
      bounds,
      scaleFactor,
      sceneSize
    )

    // Update uniforms automatically
    if (
      glElement.material.uniforms.uPlaneSizes &&
      glElement.material.uniforms.uImageSizes
    ) {
      glElement.material.uniforms.uPlaneSizes.value = glElement.scale
      glElement.material.uniforms.uImageSizes.value = [
        bounds.width,
        bounds.height,
      ]
    }
  }, [glElement, domElement, scaleFactor.x, scaleFactor.y])
}

export default useSyncDomGl
