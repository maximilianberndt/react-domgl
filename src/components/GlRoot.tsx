

import React from 'react'
import { ReactLenis } from '@studio-freight/react-lenis'
import {Canvas} from "@react-three/fiber"
import GlCamera from './GlCamera'
import tunnel from 'tunnel-rat'
import { create } from 'zustand'
import { Vector3 } from 'three'

export const glTunnel = tunnel()

export const glStore = create(()=> ({
    camera: null,
}))

const GlRoot = ({children}) => {
    return (
        <ReactLenis root>
            <Canvas 
                flat 
                style={{position: "fixed", top: 0, left: 0}} 
                camera={{fov: 75, position: new Vector3(0, 0, 5)}}
            >
                <GlCamera />
                <glTunnel.Out />
            </Canvas>
            
            {children}
        </ReactLenis>
    )
}

export default GlRoot