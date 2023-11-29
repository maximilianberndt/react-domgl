import GlRoot from "./components/GlRoot"

function App() {
  return (
    <GlRoot>
      <div style={{height: "200vh", fontSize: "100px"}}>
        <h1 style={{position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", color: "pink"}}>
          Helo
        </h1>
      </div>
    </GlRoot>
  )
}

export default App
