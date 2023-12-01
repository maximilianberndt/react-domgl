import React, { useRef } from "react"
import {glTunnel} from "./GlRoot"
import useSyncDomGl from "../hooks/useSyncDomGl"


const GlImage = ({ children }) => {
    const ref = useRef()

    useSyncDomGl(ref.current, children.ref.current)

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