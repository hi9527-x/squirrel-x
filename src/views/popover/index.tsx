import { Button, Markdown, Popover } from 'squirrel-x'
import type { SlotsType, VNode } from 'vue'
import { defineComponent } from 'vue'

type Slots = SlotsType<{
  default?: () => VNode
}>
type Emits = {}

type Props = {}

const popoverDemo = defineComponent<Props, Emits, string, Slots>((props, ctx) => {
  return () => {
    return (
      <div class="p-4">
        <div class="h-200px overflow-auto">
          <div class="h-600px">
            <Popover
              v-slots={{
                content: () => {
                  return <Markdown content="hover Popover" />
                },
              }}
            >
              <Button variant="link">hover</Button>
            </Popover>

            <Popover
              trigger="click"
              v-slots={{
                content: () => {
                  return <Markdown content="click Popover" />
                },
              }}
            >
              <Button variant="link">click</Button>
            </Popover>
          </div>
        </div>

      </div>
    )
  }
}, {
  props: [],
})

export default popoverDemo
