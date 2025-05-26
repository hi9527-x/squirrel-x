import { Empty } from 'squirrel-x'
import type { SlotsType, VNode } from 'vue'
import { defineComponent } from 'vue'

type Slots = SlotsType<{
  default?: () => VNode
}>
type Emits = {}

type Props = {}

const EmptyDemo = defineComponent<Props, Emits, string, Slots>((props, ctx) => {
  return () => {
    return (
      <div class="p-4">
        <Empty />
      </div>
    )
  }
}, {
  props: [],
})

export default EmptyDemo
