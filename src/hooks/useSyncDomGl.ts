import React, { useEffect } from "react"
import useSceneSize from "./useSceneSize"
import { useLenis } from "@studio-freight/react-lenis";

const updateX = (plane, offset = 0, bounds, scaleFactor, sceneSize) => {
    const x = bounds.left - offset
    const sceneOffset = -sceneSize.width * .5 + plane.scale.x * .5 

    plane.position.x = sceneOffset + x * scaleFactor.x
};

const updateY = (plane, offset = 0, bounds, scaleFactor, sceneSize) => {
    const y = bounds.top - offset
    const sceneOffset = sceneSize.height * .5 - plane.scale.y * .5

	plane.position.y = sceneOffset - y * scaleFactor.y
};

const updateScale = (plane, bounds, scaleFactor) => {
    plane.scale.x = bounds.width * scaleFactor.x
    plane.scale.y = bounds.height * scaleFactor.y
};

const useSyncDomGl = (glElement, domElement) => {
    const { scaleFactor, sceneSize } = useSceneSize()
    const lenis = useLenis()

    useEffect(() =>{
        if(!domElement || !glElement) return

        domElement.style.visibility = "hidden"
        const bounds = domElement.getBoundingClientRect()

        // TODO: The scrollbar is fucking up the size calculation 
        // So the webgl element is slightly smaller
        updateScale(glElement, bounds, scaleFactor)
        updateX(glElement, 0, bounds, scaleFactor, sceneSize)
        updateY(glElement, -lenis.scroll, bounds, scaleFactor, sceneSize)

        // Update uniforms automatically
        // TODO: Chck first if these values exist
        glElement.material.uniforms.uPlaneSizes.value = glElement.scale
        glElement.material.uniforms.uImageSizes.value = [bounds.width, bounds.height]
    }, [glElement, domElement, scaleFactor.x, scaleFactor.y])
}

export default useSyncDomGl