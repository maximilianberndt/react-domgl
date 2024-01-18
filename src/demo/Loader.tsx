import React from 'react'
import { glStore } from '../components/GlRoot'

const Loader = () => {
  const progress = glStore((s) => s.loadingProgress)

  const style =
    progress !== 1
      ? {
          opacity: 1,
        }
      : {
          opacity: 0,
          pointerEvents: 'none',
        }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'black',
        color: 'white',
        transition: 'opacity 0.5s linear',
        ...style,
      }}
    >
      {progress * 100}
    </div>
  )
}

export default Loader
