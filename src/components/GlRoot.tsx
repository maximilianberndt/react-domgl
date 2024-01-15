

import React from 'react'
import { ReactLenis } from '@studio-freight/react-lenis'
import {Canvas} from "@react-three/fiber"
import GlCamera from './GlCamera'
import tunnel from 'tunnel-rat'
import { create } from 'zustand'
import { TextureLoader } from 'three/src/loaders/TextureLoader'

export const textureLoader = new TextureLoader()

export const glTunnel = tunnel()

export const glStore = create(()=> ({
    camera: null,
}))

const GlRoot = ({children}) => {
    return (
        <ReactLenis root options={{
            // gestureOrientation: 'both',
            smoothWheel: true,
            // smoothTouch: true,
            syncTouch: true,}}
        >
            <Canvas 
                flat
                linear 
                style={{position: "fixed", top: 0, left: 0, right: 0, height: "100vh"}} 
                // camera={{manual: true}}
            >
                <GlCamera />
                <glTunnel.Out />
            </Canvas>
            
            {children}
        </ReactLenis>
    )
}

export default GlRoot