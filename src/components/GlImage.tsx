import React, { useEffect, useMemo, useRef } from "react"
import vertexShader from "../glsl/base/vert.glsl"
import fragmentShader from "../glsl/base/frag.glsl"
import {glTunnel, textureLoader} from "./GlRoot"
import useSyncDomGl from "../hooks/useSyncDomGl"

const GlImage = ({ children }) => {
    const ref = useRef()
    const image = children?.ref?.current

    const uniforms = useMemo(() => ({
        uPlaneSizes: {value: [1, 1]},
        uImageSizes: {value: [1,1]},
        tMap: {value: {}}
    }), [])

    useSyncDomGl(ref.current, image)

    useEffect(() => {
        const src = image?.src
        if(src) {
            textureLoader.load(src, (data) => {
                uniforms.tMap.value = data
            })
        }
    }, [image])


    return (
        <>
            <glTunnel.In>
                <mesh ref={ref}>
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

export default GlImage