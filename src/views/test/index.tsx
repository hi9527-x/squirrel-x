import { Markdown } from 'squirrel-x'
import type { SlotsType, VNode } from 'vue'
import { defineComponent } from 'vue'

import content from './markdown.md?raw'

type Slots = SlotsType<{
  default?: () => VNode
}>
type Emits = {}

type Props = {}

const Test = defineComponent<Props, Emits, string, Slots>((props, ctx) => {
  return () => {
    return (
      <div class="p4">
        <Markdown
          content={content}
        />

        <span>&#x1F60A;</span>
      </div>
    )
  }
}, {
  props: [],
})

export default Test
