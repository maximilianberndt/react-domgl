import React from 'react'
import { glTunnel } from './GlRoot'

const GlElement = ({ children }) => {
  return <glTunnel.In>{children}</glTunnel.In>
}

export default GlElement
