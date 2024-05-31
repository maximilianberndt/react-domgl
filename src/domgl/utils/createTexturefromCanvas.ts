import { OGLRenderingContext, Texture } from 'ogl'
import { RefObject } from 'react'

const canvas = document.createElement('canvas')
const ctx = canvas.getContext('2d')

// TODO: Create multy line text with: https://github.com/geongeorge/Canvas-Txt

const createTextureFromCanvas = (
  node: RefObject<HTMLElement>,
  gl: OGLRenderingContext
): Texture => {
  const text = node.current
  if (!text || !gl || !ctx) return null

  const bounds = text.getBoundingClientRect()
  const s = getComputedStyle(text)
  const fontSize = parseFloat(s.fontSize)

  canvas.width = bounds.width * 2
  canvas.height = bounds.height * 2

  ctx.clearRect(0.0, 0.0, canvas.width, canvas.height)

  ctx.font = `normal ${fontSize * 2}px sans-serif`
  ctx.fillStyle = s.color
  ctx.textBaseline = 'middle'
  ctx.fillText(text.innerText, 0, bounds.height * 1)

  const texture = new Texture(gl)
  const img = new Image()
  img.src = canvas.toDataURL('image/webp', 1)
  img.onload = () => {
    texture.image = img
  }

  return texture
}

export default createTextureFromCanvas
