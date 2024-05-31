import { RefObject } from 'react'

const canvas = document.createElement('canvas')
const ctx = canvas.getContext('2d')

const createTextureFromCanvas = (
  node: RefObject<HTMLElement>
): HTMLImageElement['src'] => {
  const text = node.current
  if (!text) return null

  const bounds = text.getBoundingClientRect()
  const s = getComputedStyle(text)
  const fontSize = parseFloat(s.fontSize)

  canvas.width = bounds.width * 4
  canvas.height = bounds.height * 4

  ctx.font = `normal ${fontSize * 4}px sans-serif`
  ctx.fillText(text.innerText, 0, bounds.height * 2)

  const img = document.createElement('img')
  img.src = canvas.toDataURL('image/webp')

  return img.src
}

export default createTextureFromCanvas
