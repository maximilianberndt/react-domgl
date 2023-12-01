import React, { useRef } from "react"
import {glTunnel} from "./GlRoot"
import useSyncDomGl from "../hooks/useSyncDomGl"


const GlImage = ({ children }) => {
    const ref = useRef()

    // TODO: Cleanup this
    useSyncDomGl(ref.current, children?.ref?.current || children.find(el => el.type === "img").ref.current)


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