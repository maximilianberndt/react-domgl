import { useThree } from "@react-three/fiber"
import { useLenis } from "@studio-freight/react-lenis"
import React, { useEffect } from "react"
import useSceneSize from '../hooks/useSceneSize'
import { glStore } from "./GlRoot"

const GlCamera = () =>{
    const {scaleFactor} = useSceneSize()
    const { camera } = useThree()
    
    useLenis(({ scroll }) =>  {
        if(!camera) return
        camera.position.y = -scroll * scaleFactor.y
    }, [scaleFactor])

    useEffect(() => {
        glStore.setState({ camera })
    }, [camera])

    return (
        <></>
    )
}

export default GlCamera