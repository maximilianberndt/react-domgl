import React, { Fragment, useEffect, useRef } from "react"
import {glTunnel} from "./GlRoot"

const GlImage = ({ children }) => {

    return (
        <>
            <glTunnel.In>
                <mesh>
                    <planeGeometry args={[1, 1, 1]} />
                    <meshBasicMaterial color={'orange'} />
                </mesh>
            </glTunnel.In>
            
            {children}
        </>
    )
}

export default GlImage