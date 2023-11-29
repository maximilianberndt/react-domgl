

import React from 'react'
import { ReactLenis, useLenis } from '@studio-freight/react-lenis'
import {Canvas} from "@react-three/fiber"
import GlCamera from './GlCamera'

const GlRoot = ({children}) => {
    return (
        <ReactLenis root>
            <Canvas flat style={{position: "fixed", top: 0, left: 0}}>
                <GlCamera />

                <mesh>
                    <planeGeometry args={[1, 1, 1]} />
                    <meshStandardMaterial color={'orange'} />
                </mesh>
            </Canvas>
            
            {children}
        </ReactLenis>
    )
}

export default GlRoot