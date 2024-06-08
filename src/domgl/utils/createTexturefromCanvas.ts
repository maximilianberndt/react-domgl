import { drawText } from 'canvas-txt'
import { OGLRenderingContext, Texture } from 'ogl'
import { type RefObject } from 'react'

const canvas = document.createElement('canvas')
const ctx = canvas.getContext('2d')

// TODO: Create multy line text with: https://github.com/geongeorge/Canvas-Txt

const createTextureFromCanvas = (
  node: RefObject<HTMLElement>,
  gl: OGLRenderingContext,
  font = 'sans-serif'
): Texture => {
  const text = node.current
  if (!text || !gl || !ctx) return null

  const dpr = window.devicePixelRatio
  const bounds = text.getBoundingClientRect()
  const s = getComputedStyle(text)

  const align = { start: 'left' }[s.textAlign] || ('left' as const)
  const fontSize = parseFloat(s.fontSize) * dpr
  const lineHeight =
    s.lineHeight === 'normal' ? 1.2 : parseFloat(s.lineHeight) * 2

  const width = bounds.width * (dpr + 0.01)
  const height = bounds.height * (dpr + 0.01)

  canvas.width = width
  canvas.height = height

  ctx.clearRect(0.0, 0.0, canvas.width, canvas.height)

  drawText(ctx, text.innerText, {
    x: 0,
    y: 0,
    width,
    height,
    fontSize,
    align,
    lineHeight,
    font,
    fontWeight: s.fontWeight,
  })

  const texture = new Texture(gl)
  const img = new Image()
  img.src = canvas.toDataURL('image/webp', 1)
  img.onload = () => {
    texture.image = img
  }

  return texture
}

export default createTextureFromCanvas
