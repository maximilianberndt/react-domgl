import { Box, MeshTransmissionMaterial } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import React, { useEffect, useRef } from 'react'
import { Mesh, Vector2 } from 'three'
import useSceneSize from '../hooks/useSceneSize'

const Object = () => {
  const ref = useRef<Mesh>(null)

  const pointer = useRef(new Vector2())
  const pointerCurrent = useRef(new Vector2())
  const { scaleFactor } = useSceneSize()

  useFrame((_, delta) => {
    if (!ref.current) return
    ref.current.rotation.x += 0.01
    ref.current.rotation.y += 0.01

    pointerCurrent.current.lerp(
      pointer.current,
      (delta / 0.016) * 0.03
    )

    ref.current.position.x =
      (pointerCurrent.current.x - window.innerWidth * 0.5) *
      0.5 *
      scaleFactor.x
    ref.current.position.y =
      (-pointerCurrent.current.y + window.innerHeight * 0.5) *
      0.5 *
      scaleFactor.y
    ref.current.position.z = 1.2
  })

  useEffect(() => {
    const onMouseMove = (e) => {
      pointer.current.set(e.clientX, e.clientY)
    }

    document.body.addEventListener('mousemove', onMouseMove)

    return () => {
      document.body.removeEventListener('mousemove', onMouseMove)
    }
  }, [])

  return (
    <Box ref={ref} args={[1, 1, 1]}>
      <MeshTransmissionMaterial
        ior={1.14}
        thickness={1.4}
        anisotropy={0.14}
        chromaticAberration={0.14}
        distortion={0.14}
        distortionScale={1.4}
        temporalDistortion={0.14}
      />
    </Box>
  )
}

export default Object
