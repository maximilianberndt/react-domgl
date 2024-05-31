import { useLenis } from 'lenis/react'
import { useEffect } from 'react'
import { useOGL } from 'react-ogl'
import useSceneSize from './hooks/useSceneSize'
import { glStore } from './utils/glStore'

const GlCamera = () => {
  const { scaleFactor } = useSceneSize()
  const camera = useOGL((state) => state.camera)

  useLenis(
    ({ scroll }) => {
      if (!camera) return
      camera.position.y = -scroll * scaleFactor.y
    },
    [scaleFactor]
  )

  useEffect(() => {
    glStore.setState({ camera })
  }, [camera])

  return null
}

export default GlCamera
