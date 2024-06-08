import { Mesh, Transform } from 'ogl'
import { Instance, RootState } from 'react-ogl'

// Copy of this https://github.com/pmndrs/react-ogl/blob/main/src/utils.ts
// Just taking event.clientX for calculating the mouse coordinates

export function createEvents(state: RootState) {
  const handleEvent = (event: PointerEvent, type: any) => {
    // Convert mouse coordinates
    // state.mouse!.x = (event.offsetX / state.size.width) * 2 - 1
    // state.mouse!.y = -(event.offsetY / state.size.height) * 2 + 1
    state.mouse!.x = (event.clientX / state.size.width) * 2 - 1
    state.mouse!.y = -(event.clientY / state.size.height) * 2 + 1

    // Filter to interactive meshes
    const interactive: Mesh[] = []
    state.scene.traverse((node: Transform) => {
      // Mesh has registered events and a defined volume
      if (
        node instanceof Mesh &&
        (node as Instance<Mesh>['object']).__handlers &&
        node.geometry?.attributes?.position
      )
        interactive.push(node)
    })

    // Get elements that intersect with our pointer
    state.raycaster!.castMouse(state.camera, state.mouse)
    const intersects: Mesh[] =
      state.raycaster!.intersectMeshes(interactive)

    // Used to discern between generic events and custom hover events.
    // We hijack the pointermove event to handle hover state
    const isHoverEvent = type === 'onPointerMove'

    // Trigger events for hovered elements
    for (const entry of intersects) {
      // Bail if object doesn't have handlers (managed externally)
      if (!(entry as unknown as any).__handlers) continue

      const object = entry as Instance<Mesh>['object']
      const handlers = object.__handlers

      if (isHoverEvent && !state.hovered!.get(object.id)) {
        // Mark object as hovered and fire its hover events
        state.hovered!.set(object.id, object)

        // Fire hover events
        handlers.onPointerMove?.({
          ...object.hit,
          nativeEvent: event,
        })
        handlers.onPointerOver?.({
          ...object.hit,
          nativeEvent: event,
        })
      } else {
        // Otherwise, fire its generic event
        handlers[type]?.({ ...object.hit, nativeEvent: event })
      }
    }

    // Cleanup stale hover events
    if (isHoverEvent || type === 'onPointerDown') {
      state.hovered!.forEach((object) => {
        const handlers = object.__handlers

        if (
          !intersects.length ||
          !intersects.find((i) => i === object)
        ) {
          // Reset hover state
          state.hovered!.delete(object.id)

          // Fire unhover event
          if (handlers?.onPointerOut)
            handlers.onPointerOut({
              ...object.hit,
              nativeEvent: event,
            })
        }
      })
    }

    return intersects
  }

  return { handleEvent }
}
