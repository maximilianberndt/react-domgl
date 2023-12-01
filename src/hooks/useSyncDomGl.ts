import React, { useEffect } from "react"
import useSceneSize from "./useSceneSize"

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

    useEffect(() =>{
        if(!domElement || !glElement) return

        domElement.style.visibility = "hidden"
        const bounds = domElement.getBoundingClientRect()

       updateScale(glElement, bounds, scaleFactor)
       updateX(glElement, 0, bounds, scaleFactor, sceneSize)
       updateY(glElement, 0, bounds, scaleFactor, sceneSize)
    }, [glElement, domElement, scaleFactor.x, scaleFactor.y])
}

export default useSyncDomGl