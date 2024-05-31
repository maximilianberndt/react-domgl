import { Mesh } from 'ogl'
import { RefObject, useCallback, useRef } from 'react'
// import useResizeObserver from 'use-resize-observer'
import { useLenis } from 'lenis/react'
import { useFrame } from 'react-ogl'
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
  offsetX: RefObject<number>
  offsetY: RefObject<number>
}

const useSyncDomGl = (
  domElement: RefObject<HTMLElement>,
  {
    syncScale = false,
    offsetX = { current: 0 },
    offsetY = { current: 0 },
  }: Partial<SyncOptions> = {}
) => {
  const glElement = useRef<Mesh | null>(null)
  const boundsRef = useRef<DOMRect>()
  const { scaleFactor, sceneSize } = useSceneSize()

  const lenis = useLenis()

  const sync = useCallback(
    (mesh: Mesh) => {
      if (!domElement.current || !mesh) return
      glElement.current = mesh

      const isPlane = { IMG: true, VIDEO: true }[
        domElement.current.nodeName
      ]

      if (isPlane) {
        domElement.current.style.visibility = 'hidden'
      } else {
        // isText
        domElement.current.style.color = 'transparent'
      }

      const bounds = domElement.current.getBoundingClientRect()

      boundsRef.current = {
        top: bounds.top + lenis.scroll,
        left: bounds.left,
        width: bounds.width,
        height: bounds.height,
      }
    },
    [lenis]
  )

  useFrame(() => {
    const mesh = glElement.current
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

  // TODO: Do we need resize observer?
  // const { ref } = useResizeObserver<HTMLElement>({ onResize: resize })

  // useEffect(() => {
  //   ref(domElement)
  // }, [domElement])

  return { sync, ref: glElement }
}

export default useSyncDomGl
