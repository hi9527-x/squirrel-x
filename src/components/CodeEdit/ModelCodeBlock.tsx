import type { SlotsType, VNode } from 'vue'
import { defineComponent } from 'vue'

type Slots = {
  default: () => VNode
}
type Emits = {}
type Props = {}

const ModelCodeBlock = defineComponent<Props, Emits, string, SlotsType<Slots>>((props, ctx) => {
  return () => {
    return (
      <>
        {ctx.slots.default?.()}

        <p>123</p>
      </>
    )
  }
}, {
  props: [],
})

export default ModelCodeBlock
