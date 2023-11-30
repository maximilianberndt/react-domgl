

import React from 'react'
import { ReactLenis, useLenis } from '@studio-freight/react-lenis'
import {Canvas} from "@react-three/fiber"
import GlCamera from './GlCamera'
import tunnel from 'tunnel-rat'

export const glTunnel = tunnel()

const GlRoot = ({children}) => {
    return (
        <ReactLenis root>
            <Canvas flat style={{position: "fixed", top: 0, left: 0}}>
                <GlCamera />
                <glTunnel.Out />
            </Canvas>
            
            {children}
        </ReactLenis>
    )
}

export default GlRoot