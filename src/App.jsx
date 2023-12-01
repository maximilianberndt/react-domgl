import { useRef } from "react"
import GlImage from "./components/GlImage"
import GlRoot from "./components/GlRoot"

function App() {
  const ref = useRef()

  return (
    <GlRoot>
      <div style={{height: "200vh", fontSize: "100px"}} />
        <GlImage>
          <img 
            ref={ref} 
            src="/test.png"
            style={{width: "30vw", position: "absolute", top: "10%", left: "10%", aspectRatio: "1 / 1"}} 
          />
        </GlImage>

        <h1 style={{position: "absolute", top: "30%", left: "30%", fontSize: "20vw"}}>Test</h1>
    </GlRoot>
  )
}

export default App
