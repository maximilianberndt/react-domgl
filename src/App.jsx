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
            style={{width: "30vw", position: "absolute", top: "30%", left: "50%", transform: "translate(-50%, -50%)"}} 
          />
        </GlImage>
    </GlRoot>
  )
}

export default App
