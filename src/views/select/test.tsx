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
          size="small"
          options={[
            { label: '选项1', value: 'opt1' },
            { label: '选项2', value: 'opt2' },
            { label: '选项3', value: 'opt3' },
            { label: '选项4', value: 'opt4' },
          ]}
        />
      </div>
    )
  }
}, {
  props: [],
})

export default SelectTest
