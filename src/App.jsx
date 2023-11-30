import GlImage from "./components/GlImage"
import GlRoot from "./components/GlRoot"

function App() {
  return (
    <GlRoot>
      <div style={{height: "200vh", fontSize: "100px"}} />
        <GlImage>
          <img src="/test.png"  style={{width: "10vw", position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)"}} />
        </GlImage>
    </GlRoot>
  )
}

export default App
