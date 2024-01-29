import { Stats } from '@react-three/drei'
import { EffectComposer } from '@react-three/postprocessing'
import { useLenis } from '@studio-freight/react-lenis'
import gsap from 'gsap'
import { useControls } from 'leva'
import React, { useRef } from 'react'
import { lerp } from 'three/src/math/MathUtils'
import GlElement from '../components/GlElement'
import GlRoot from '../components/GlRoot'
import Background from './Background'
import Debug from './Debug'
import Image from './Image'
import Model from './Model'
import Object from './Object'
import Pass from './Pass'
import Text from './Text'
import Video from './Video'
import s from './demo.module.scss'

const loader = document.querySelector('#loader') as HTMLDivElement

const Demo = () => {
  const passRef = useRef()
  const currentVelocity = useRef(0)

  const { enabled } = useControls('DomGL', { enabled: true })

  const effectComposerProps = useControls('Post Processing', {
    enabled: true,
  })

  const statsProps = useControls('Stats', {
    enabled: false,
  })

  const postPassProps = useControls('Post Pass', {
    frequency: { value: Math.PI, min: 1, max: 20 },
    amplitude: { value: 0, min: 0, max: 1 },
    blocksStrength: { value: 1 },
    rotation: { value: -10, min: -20, max: 0 },
  })

  const lenis = useLenis(({ velocity }) => {
    currentVelocity.current = lerp(
      currentVelocity.current,
      velocity,
      0.1
    )

    if (!passRef.current) return
    const v = currentVelocity.current
    passRef.current.uniforms.get('amplitude').value = v * -0.006
  })

  return (
    <>
      <Debug />

      <GlRoot
        enabled={enabled}
        onLoadingProgress={(progress) => {
          if (loader) loader.innerText = `${progress * 100}`
        }}
        onLoad={() => {
          const interval = setInterval(() => {
            const pass = passRef.current

            if (pass) {
              // FadeIn animation
              const rotation = pass.uniforms.get('rotation')
              gsap.to(rotation, {
                value: 0,
                duration: 1.5,
                ease: 'expo.inOut',
              })

              // Fade out loader
              if (loader) {
                loader.style.transitionDelay = '0.2s'
                loader.style.opacity = '0'
                loader.style.pointerEvents = 'none'
              }

              clearInterval(interval)
            }
          }, 50)
        }}
      >
        {statsProps.enabled && <Stats />}

        <GlElement>
          <EffectComposer {...effectComposerProps}>
            <Pass key={1} ref={passRef} {...postPassProps} />
          </EffectComposer>
        </GlElement>

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
            I call this technique DomGl because it allows you to mix
            WebGl with regular dom elements. We can copy the position
            and size of elements and perfectly recreate them in the
            WebGL world. This allows to add fancy effects to any
            element. Notice the fade in animation, how the text is
            reflected in the cube and how the site bends during
            scroll. All of this would not be possible without WebGL.
          </Text>

          <div className={s.imageGrid}>
            <Video
              src={'/test.mp4'}
              style={{ aspectRatio: '16 / 9' }}
            />

            {[
              { src: '/header.webp', aspectRatio: '384 / 216' },
              { src: '/image-2.webp', aspectRatio: '16 / 9' },
              { src: '/image-3.webp', aspectRatio: '3072 / 2048' },
              { src: '/image-4.webp', aspectRatio: '16 / 9' },
            ].map(({ src, aspectRatio }) => (
              <Image key={src} src={src} style={{ aspectRatio }} />
            ))}
          </div>

          <Text className={s.copy}>
            Also we can seamlessly integrate 3d models:
          </Text>

          <Model src="ym.glb" />

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
            { copy: 'Buttermax', link: 'https://buttermax.net/' },
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

          <div className={s.footer}>
            <Text className={s.copy}>
              The good thing is that we can apply this effect to only
              the elements that we want. For example this button is
              just html + css. But we could aslo recreate it in WebGl
              and then it could have the same animation as the images.
              Or a different one. The possibilities are endless.
            </Text>

            <button
              className={s.button}
              onClick={() =>
                lenis.scrollTo(0, {
                  duration: 2,
                  easing: (x) =>
                    x < 0.5
                      ? 8 * x * x * x * x
                      : 1 - Math.pow(-2 * x + 2, 4) / 2,
                })
              }
            >
              <span className={s.headline}>Scroll to top</span>
            </button>
          </div>
        </div>
      </GlRoot>
    </>
  )
}

export default Demo
