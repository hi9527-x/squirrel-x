import { VueMarkdownPro } from 'squirrel-x'
import type { SlotsType, Text, VNode } from 'vue'
import { defineComponent } from 'vue'

import content from '../../../README.md?raw'

type Slots = SlotsType<{
  default?: () => VNode
}>
type Emits = {}
type Props = {}

const Guide = defineComponent<Props, Emits, string, Slots>((props, ctx) => {
  return () => {
    return (
      <div class="">
        <VueMarkdownPro content={content} class="" />
      </div>
    )
  }
}, {
  props: [],
})

export default Guide
