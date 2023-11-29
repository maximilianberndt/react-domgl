import { useWindowSize } from 'usehooks-ts'
import { useFrame, useThree } from "@react-three/fiber"
import { useLenis } from "@studio-freight/react-lenis"
import React, { useMemo, useRef } from "react"

const GlCamera = () =>{
    const scrollRef = useRef(0)
    
    const { camera } = useThree()
    const { width, height } = useWindowSize()

    const sceneSize = useMemo(() => {
        const fov = camera.fov * (Math.PI / 180);
        const height = 2 * Math.tan(fov / 2) * camera.position.z;
		const width = height * camera.aspect;

        return {width, height}
    }, [width, height, camera])

    useLenis(({ scroll }) =>  scrollRef.current = scroll)
    
    useFrame(({ camera }) =>{
        if(!camera) return

        const scaleFactor = sceneSize.height / height
        camera.position.y = -scrollRef.current * scaleFactor
    })

    return (
        <></>
    )
}

export default GlCamera