import { useRef } from "react"
import GlImage from "./components/GlImage"
import GlRoot from "./components/GlRoot"
import GlVideo from "./components/GlVideo"

function App() {
  const imageRef = useRef()
  const videoRef = useRef()

  return (
    <GlRoot>
      <div style={{height: "200vh", fontSize: "100px"}}>
        <GlImage>
          <img 
            ref={imageRef} 
            src="/test.png"
            style={{width: "30vw", marginTop: "10%", marginLeft: "10%", aspectRatio: "1 / 1"}} 
          />
        </GlImage>

        <GlVideo>
          <video 
            ref={videoRef}
            src="/test.mp4"
            style={{width: "40vw", aspectRatio: "16 / 9"}} 
          />
        </GlVideo>

        <h1 style={{fontSize: "20vw", position: "absolute", top: "30%", left: "20%"}}>Test</h1>

        </div>
    </GlRoot>
  )
}

export default App
