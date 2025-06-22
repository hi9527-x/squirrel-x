import { Code } from 'squirrel-x'
import type { SlotsType, VNode } from 'vue'
import { defineComponent } from 'vue'

import AlertTest from './test'
import AlertTestCode from './test?raw'

type Slots = {}
type Emits = {}
type Props = {}

const AlertDemo = defineComponent<Props, Emits, string, SlotsType<Slots>>((props, ctx) => {
  return () => {
    return (
      <div class="p-4">
        <AlertTest />

        <div class="mt-4 border b-gray rounded b-solid">
          <Code
            language="typescript"
            code={AlertTestCode}
          />
        </div>
      </div>
    )
  }
}, {
  props: [],
})

export default AlertDemo
