import { Markdown } from 'squirrel-x'
import type { SlotsType, VNode } from 'vue'
import { defineComponent } from 'vue'

import baseContent from './base.md?raw'

type Slots = SlotsType<{
  default?: () => VNode
}>
type Emits = {}

type Props = {}

const changelog = defineComponent<Props, Emits, string, Slots>((props, ctx) => {
  return () => {
    return (
      <div class="p-4">
        <Markdown content={baseContent} />
      </div>
    )
  }
}, {
  props: [],
})

export default changelog
