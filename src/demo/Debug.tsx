import { Leva } from 'leva'
import React from 'react'

const Debug = () => {
  const show =
    import.meta.env.DEV || window.location.hash === '#debug'

  return <Leva hidden={!show} />
}

export default Debug
