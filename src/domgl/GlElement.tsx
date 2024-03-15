import React, { Suspense } from 'react'
import { glTunnel } from './utils/glTunnel'

// TODO: add Fallback option
const GlElement = ({ children }) => {
  return (
    <Suspense>
      <glTunnel.In>{children}</glTunnel.In>
    </Suspense>
  )
}

export default GlElement
