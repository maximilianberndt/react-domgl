import { useThree } from "@react-three/fiber";
import { useMemo } from "react";
import { useWindowSize } from "usehooks-ts";
import { glStore } from "../components/GlRoot";



const useSceneSize = (): {
    sceneSize: { width: number, height: number},
    windowSize: { width: number, height: number},
    scaleFactor: {x: number, y: number}
} => {
    const camera = glStore(s => s.camera)
    const windowSize = useWindowSize()

    // TODO: Should this be a memo or a ref?
    const sceneSize = useMemo(() => {
        if(!camera) return { 
            sceneSize: { width:  1, height: 1 },
            windowSize,
            scaleFactor: {
                x: 1,
                y: 1
            }
        }
        const fov = camera.fov * (Math.PI / 180);
        const height = 2 * Math.tan(fov / 2) * camera.position.z;
		const width = height * camera.aspect;

        return { 
            sceneSize: { width, height },
            windowSize,
            scaleFactor: {
                x: Math.min(width / windowSize.width, 1),
                y: Math.min(height / windowSize.height, 1)
            }
        }
    }, [windowSize.width, windowSize.height, camera])

    return sceneSize
}

export default useSceneSize