import { Stats } from '@react-three/drei'
import { useLenis } from '@studio-freight/react-lenis'
import { useControls } from 'leva'
import React, { useRef } from 'react'
import GlElement from '../components/GlElement'
import GlRoot from '../components/GlRoot'
import Background from './Background'
import Image from './Image'
import Loader from './Loader'
import Object from './Object'
import Pass from './Pass'
import Text from './Text'
import Video from './Video'

const Demo = () => {
  const passRef = useRef()

  const postPassProps = useControls('Post Pass', {
    frequency: { value: Math.PI, min: 1, max: 20 },
    amplitude: { value: 0, min: 0, max: 1 },
    blocksStrength: { value: 1 },
    rotation: { value: 0, min: -20, max: 0 },
  })

  useLenis(({ velocity }) => {
    if (!passRef.current) return
    passRef.current.uniforms.get('amplitude').value =
      velocity * -0.005

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

        <Image src={'/test.png'} />

        <Video src={'/test.mp4'} />

        <Text
          style={{
            fontSize: '20vw',
            position: 'absolute',
            top: '300px',
            left: '200px',
          }}
        >
          Helo Helo Helo
        </Text>
      </GlRoot>

      <Loader />
    </>
  )
}

export default Demo
