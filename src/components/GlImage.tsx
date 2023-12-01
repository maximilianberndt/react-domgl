import React, { Fragment, useEffect, useRef } from "react"
import {glTunnel} from "./GlRoot"
import useSceneSize from "../hooks/useSceneSize"

const GlImage = ({ children }) => {
    const ref = useRef()
    const { scaleFactor } = useSceneSize()

    useEffect(() =>{
        const el = children.ref.current
        const plane = ref.current
        if(!el || !plane) return

        el.style.visibility = "hidden"
        const bounds = el.getBoundingClientRect()

        plane.scale.x = bounds.width * scaleFactor.x
        plane.scale.y = bounds.height * scaleFactor.y

        console.log(plane.scale, bounds.width, bounds.height)
    }, [children, scaleFactor.x, scaleFactor.y])

    return (
        <>
            <glTunnel.In>
                <mesh ref={ref}>
                    <planeGeometry args={[1, 1, 1]} />
                    <meshBasicMaterial color={'orange'} />
                </mesh>
            </glTunnel.In>
            
            {children}
        </>
    )
}

export default GlImage