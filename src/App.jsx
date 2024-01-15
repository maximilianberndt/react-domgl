import { useRef } from 'react'
import GlImage from './components/GlImage'
import GlRoot from './components/GlRoot'
import GlText from './components/GlText'
import GlVideo from './components/GlVideo'

function App() {
  const imageRef = useRef()
  const videoRef = useRef()
  const textRef = useRef()

  return (
    <GlRoot>
      <div style={{ height: '200vh', fontSize: '100px' }}>
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
            ref={videoRef}
            src="/test.mp4"
            style={{ width: '40vw', aspectRatio: '16 / 9' }}
          />
        </GlVideo>

        <GlText>
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
  )
}

export default App
