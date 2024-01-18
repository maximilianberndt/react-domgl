import { Stats } from '@react-three/drei'
import { Noise } from '@react-three/postprocessing'
import { useLenis } from '@studio-freight/react-lenis'
import { useControls } from 'leva'
import React, { useRef } from 'react'
import GlElement from '../components/GlElement'
import GlRoot from '../components/GlRoot'
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
  })

  useLenis((p) => {
    if (!passRef.current) return
    passRef.current.uniforms.get('amplitude').value =
      p.velocity * 0.005
    // console.log(p.velocity, )
  })

  return (
    <>
      <GlRoot
        passes={[
          <Noise key={0} opacity={0.4} />,
          <Pass key={1} ref={passRef} {...postPassProps} />,
        ]}
        effectComposerProps={{ enabled: true }}
      >
        <Stats />

        <GlElement>
          <Object />
        </GlElement>

        <Image src={'/test.png'} />

        <Video src={'/test.mp4'} />

        <Text>Helo Helo Helo</Text>
      </GlRoot>

      <Loader />
    </>
  )
}

export default Demo
