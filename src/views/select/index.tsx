import { Code } from 'squirrel-x'
import type { SlotsType, VNode } from 'vue'
import { defineComponent } from 'vue'

import SelectTest from './test'
import SelectTestCode from './test?raw'

type Slots = SlotsType<{
  default?: () => VNode
}>
type Emits = {}

type Props = {}

const SelectDemo = defineComponent<Props, Emits, string, Slots>((props, ctx) => {
  return () => {
    return (
      <div class="p4">
        <SelectTest />

        <div class="mt-4 border b-gray rounded b-solid">
          <Code
            language="typescript"
            code={SelectTestCode}
          />
        </div>
      </div>
    )
  }
}, {
  props: [],
})

export default SelectDemo
