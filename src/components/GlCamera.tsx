import { useThree } from "@react-three/fiber"
import { useLenis } from "@studio-freight/react-lenis"
import React from "react"
import useSceneSize from '../hooks/useSceneSize'

const GlCamera = () =>{
    const {scaleFactor} = useSceneSize()
    const {camera} = useThree()
    
    useLenis(({ scroll }) =>  {
        if(!camera) return
        camera.position.y = -scroll * scaleFactor.y
    }, [scaleFactor])

    return (
        <></>
    )
}

export default GlCamera