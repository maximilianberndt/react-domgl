import {
  EffectComposer,
  EffectComposerProps,
} from '@react-three/postprocessing'
import { Effect } from 'postprocessing'
import React from 'react'

export interface PostProcessingProps {
  passes: Effect[]
  effectComposerProps: Omit<EffectComposerProps, 'children'>
}

const PostProcessing = ({
  passes,
  effectComposerProps,
}: PostProcessingProps): JSX.Element => {
  if (!passes.length) return <></>

  return (
    <EffectComposer {...effectComposerProps}>{passes}</EffectComposer>
  )
}
export default PostProcessing
