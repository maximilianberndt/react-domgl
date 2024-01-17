import { Box, MeshTransmissionMaterial } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { Noise } from '@react-three/postprocessing'
import { useLenis } from '@studio-freight/react-lenis'
import { useEffect, useMemo, useRef } from 'react'
import { Vector2 } from 'three'
import GlElement from './components/GlElement'
import GlImage from './components/GlImage'
import GlRoot, { glStore } from './components/GlRoot'
import GlText from './components/GlText'
import GlVideo from './components/GlVideo'
import useSceneSize from './hooks/useSceneSize'

const Object = () => {
  const ref = useRef()
  const scrollY = useRef(0)
  const pointer = useRef(new Vector2())
  const pointerCurrent = useRef(new Vector2())
  const { scaleFactor } = useSceneSize()

  useLenis(({ scroll }) => {
    scrollY.current = scroll
  })

  useFrame(() => {
    if (!ref.current) return
    ref.current.rotation.x += 0.01
    ref.current.rotation.y += 0.01

    pointerCurrent.current.lerp(pointer.current, 0.03)

    ref.current.position.x =
      (pointerCurrent.current.x - window.innerWidth * 0.5) *
      0.5 *
      scaleFactor.x
    ref.current.position.y =
      -scrollY.current * scaleFactor.y +
      (-pointerCurrent.current.y + window.innerHeight * 0.5) *
        0.5 *
        scaleFactor.y
    ref.current.position.z = 1.5
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
    <Box ref={ref}>
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

const Loader = () => {
  const progress = glStore((s) => s.loadingProgress)

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'black',
        color: 'white',
        visibility: progress === 1 ? 'hidden' : 'visible',
      }}
    >
      {progress * 100}
    </div>
  )
}

function App() {
  const imageRef = useRef()
  const videoRef = useRef()
  const textRef = useRef()

  const passes = useMemo(() => [<Noise key={0} opacity={0.4} />], [])

  return (
    <>
      <GlRoot passes={passes} effectComposerProps={{ enabled: true }}>
        <div style={{ height: '200vh', fontSize: '100px' }}>
          <GlElement>
            <Object />
          </GlElement>

          <GlImage>
            <img
              ref={imageRef}
              src="/test.png"
              style={{
                width: '30vw',
                marginTop: '10%',
                marginLeft: '10%',
                aspectRatio: '1 / 1',
              }}
            />
          </GlImage>

          <GlVideo>
            <video
              playsInline
              muted
              ref={videoRef}
              src="/test.mp4"
              style={{ width: '40vw', aspectRatio: '16 / 9' }}
            />
          </GlVideo>

          <GlText font={'/Inter-Medium.ttf'}>
            <h1
              ref={textRef}
              style={{
                fontSize: '20vw',
                position: 'absolute',
                top: '300px',
                left: '200px',
              }}
            >
              Test Test Test
            </h1>
          </GlText>
        </div>
      </GlRoot>
      <Loader />
    </>
  )
}

export default App
