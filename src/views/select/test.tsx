import { Select } from 'squirrel-x'
import type { SlotsType, VNode } from 'vue'
import { defineComponent } from 'vue'

type Slots = SlotsType<{
  default?: () => VNode
}>
type Emits = {}

type Props = {}

const SelectTest = defineComponent<Props, Emits, string, Slots>((props, ctx) => {
  return () => {
    return (
      <div>
        <Select
          placeholder="请选择！"
          class="w-120px"
          size="small"
          options={[...Array.from({ length: 100 }).keys()].map((value) => {
            return { label: `选项-${value}`, value: value.toString() }
          })}
        />
      </div>
    )
  }
}, {
  props: [],
})

export default SelectTest
