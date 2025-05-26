import { Code } from 'squirrel-x'
import type { SlotsType, VNode } from 'vue'
import { defineComponent } from 'vue'

import ButtonTest from './test'
import ButtonTestCode from './test?raw'

type Slots = SlotsType<{
  default?: () => VNode[]
}>
type Emits = {}

type Props = {}

const ButtonDemo = defineComponent<Props, Emits, string, Slots>((props, ctx) => {
  return () => {
    return (
      <div class="p-4">
        <ButtonTest />

        <div class="mt-4 border b-gray rounded b-solid">
          <Code
            language="typescript"
            code={ButtonTestCode}
          />
        </div>
      </div>
    )
  }
}, {
  props: [],
})

export default ButtonDemo
