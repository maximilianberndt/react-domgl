import { useEffect } from 'react'
import { glStore } from '../components/GlRoot'

const Loader = () => {
  const progress = glStore((s) => s.loadingProgress)

  useEffect(() => {
    const loader = document.querySelector('#loader') as HTMLDivElement

    if (!loader) return
    loader.innerText = `${progress * 100}`

    if (progress !== 1) return
    loader.style.opacity = '0'
    loader.style.pointerEvents = 'none'
  }, [progress])

  return null
}

export default Loader
