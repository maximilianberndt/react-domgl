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
    passRef.current.uniforms.get('amplitude').value = v * -0.006

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
            className={s.copy}
            style={{
              position: 'absolute',
              top: '17vw',
              right: '10vw',
              whiteSpace: 'nowrap',
            }}
          >
            Just scroll and you will see
          </Text>

          <Text className={s.headline} as="h1">
            Hello -
          </Text>
          <Text
            className={s.headline}
            style={{
              alignSelf: 'flex-end',
              marginTop: '-2%',
            }}
          >
            What is this?
          </Text>
          <Text className={s.copy}>
            I like to call this technique DomGl because it allows you
            to mix WebGl with regular dom elements. We can copy the
            position and size of images, videos and text and create
            WebGL elements that perfectly reflect them. This allows to
            add fancy effects to any element. Notice the fancy fadeIn
            animation, how the text is reflected in the cube and how
            the site bends during scroll. All of this would not be
            possible without WebGL.
          </Text>

          <div className={s.imageGrid}>
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

          <Text className={s.copy}>
            The good thing is that we can apply this effect to only
            the elements that we want. For example This button is just
            html + css.
          </Text>

          <Text className={s.copy}>
            I just have limited time creating this but this allows us
            to build stuff like:
          </Text>

          {[
            { copy: 'Lusion', link: 'https://lusion.co/' },
            { copy: 'Pluto', link: 'https://www.pluto.app/' },
            {
              copy: '14 Islands',
              link: 'https://www.14islands.com/',
            },
            { copy: 'Gleec', link: 'https://gleec.com/' },
          ].map(({ copy, link }) => (
            <Text
              key={link}
              className={s.headline}
              as="a"
              href={link}
              target="_blank"
            >
              {copy}
            </Text>
          ))}
        </div>
      </GlRoot>

      <Loader />
    </>
  )
}

export default Demo
