import { CodeEdit } from 'squirrel-x'
import type { SlotsType, VNode } from 'vue'
import { defineComponent } from 'vue'

type Slots = {}
type Emits = {}
type Props = {}

const CodeEditDemo = defineComponent<Props, Emits, string, SlotsType<Slots>>((props, ctx) => {
  return () => {
    return (
      <div>
        <CodeEdit />
      </div>
    )
  }
}, {
  props: [],
})

export default CodeEditDemo
