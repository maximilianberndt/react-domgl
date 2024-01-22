import { Stats } from '@react-three/drei'
import { useLenis } from '@studio-freight/react-lenis'
import { useControls } from 'leva'
import React, { useRef } from 'react'
import { lerp } from 'three/src/math/MathUtils'
import GlElement from '../components/GlElement'
import GlRoot from '../components/GlRoot'
import Background from './Background'
import Image from './Image'
import Loader from './Loader'
import Object from './Object'
import Pass from './Pass'
import Text from './Text'
import Video from './Video'
import s from './demo.module.scss'

const Demo = () => {
  const passRef = useRef()
  const currentVelocity = useRef(0)

  const postPassProps = useControls('Post Pass', {
    frequency: { value: Math.PI, min: 1, max: 20 },
    amplitude: { value: 0, min: 0, max: 1 },
    blocksStrength: { value: 1 },
    rotation: { value: 0, min: -20, max: 0 },
  })

  useLenis(({ velocity }) => {
    currentVelocity.current = lerp(
      currentVelocity.current,
      velocity,
      0.1
    )

    if (!passRef.current) return
    const v = currentVelocity.current
    passRef.current.uniforms.get('amplitude').value = v * -0.005

    // passRef.current.uniforms.get('blocksStrength').value = Math.abs(
    //   window.innerHeight - velocity * 1000
    // )

    // console.log(passRef.current.uniforms.get('blocksStrength').value)
  })

  return (
    <>
      <GlRoot
        passes={[<Pass key={1} ref={passRef} {...postPassProps} />]}
        effectComposerProps={{ enabled: true }}
      >
        <Stats />

        <GlElement>
          <Background />
        </GlElement>

        <GlElement>
          <Object />
        </GlElement>

        <div className={s.grid}>
          <Text
            style={{
              fontSize: '10vw',
            }}
          >
            DomGl
          </Text>
          <Text
            style={{
              fontSize: '10vw',
            }}
          >
            What is this?
          </Text>
          <Text
            style={{
              fontSize: '20px',
            }}
          >
            This technique allows you to easily recreate dom elements
            in WebGL. By copying the origianl position and scale. This
            allows to add fancy effects to any element. Fun!
          </Text>

          <Image
            src={'/test.png'}
            style={{
              width: '30vw',
              marginTop: '10%',
              marginLeft: '10%',
              aspectRatio: '1 / 1',
            }}
          />

          <Video
            src={'/test.mp4'}
            style={{ width: '40vw', aspectRatio: '16 / 9' }}
          />
        </div>
      </GlRoot>

      <Loader />
    </>
  )
}

export default Demo
