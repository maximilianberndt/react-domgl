import React, { useEffect, useMemo, useRef } from "react"
import vertexShader from "../glsl/base/vert.glsl"
import fragmentShader from "../glsl/base/frag.glsl"
import {glTunnel} from "./GlRoot"
import useSyncDomGl from "../hooks/useSyncDomGl"
import { VideoTexture } from "three"

const GlVideo = ({ children }) => {
    const ref = useRef()
    const video = children?.ref?.current

    const uniforms = useMemo(() => ({
        uPlaneSizes: {value: [1, 1]},
        uImageSizes: {value: [1, 1]},
        tMap: {value: {}}
    }), [])

    useSyncDomGl(ref.current, video)

    useEffect(() => {
        if(video) uniforms.tMap.value = new VideoTexture( video )
    }, [video])

    return (
        <>
            <glTunnel.In>
                <mesh 
                    ref={ref} 
                    onClick={() =>{
                        if(!video) return
                        video.paused ? video.play() : video.pause()
                    }}
                >
                    <planeGeometry args={[1, 1, 1]} />
                    <shaderMaterial 
                        uniforms={uniforms} 
                        fragmentShader={fragmentShader} 
                        vertexShader={vertexShader}
                    />
                </mesh>
            </glTunnel.In>
            
            {children}
        </>
    )
}

export default GlVideo