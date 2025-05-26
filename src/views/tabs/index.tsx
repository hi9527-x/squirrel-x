import { Tabs } from 'squirrel-x'
import type { SlotsType, VNode } from 'vue'
import { defineComponent } from 'vue'

type Slots = SlotsType<{
  default?: () => VNode
}>
type Emits = {}

type Props = {}

const TabsDemo = defineComponent<Props, Emits, string, Slots>((props, ctx) => {
  return () => {
    return (
      <div class="p4">
        <div>
          <Tabs
            items={[
              { label: 'label1', value: '1' },
              { label: 'label2', value: '2' },
            ]}
          />
        </div>

        <div class="mt4">
          <Tabs
            type="card"
            items={[
              { label: 'label1', value: '1' },
              { label: 'label2', value: '2' },
            ]}
          />
        </div>

      </div>
    )
  }
}, {
  props: [],
})

export default TabsDemo
