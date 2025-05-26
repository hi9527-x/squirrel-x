import { Markdown } from 'squirrel-x'
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
      <div class="min-w-240 flex justify-center p-5">
        <Markdown content={content} class="flex-1" />
      </div>
    )
  }
}, {
  props: [],
})

export default Guide
