import { Stats } from '@react-three/drei'
import { Noise } from '@react-three/postprocessing'
import React, { useMemo } from 'react'
import GlElement from '../components/GlElement'
import GlRoot from '../components/GlRoot'
import Image from './Image'
import Loader from './Loader'
import Object from './Object'
import Text from './Text'
import Video from './Video'

const Demo = () => {
  const passes = useMemo(() => [<Noise key={0} opacity={0.4} />], [])

  return (
    <>
      <GlRoot passes={passes} effectComposerProps={{ enabled: true }}>
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
