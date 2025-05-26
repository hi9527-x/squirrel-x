import type { RootContent } from 'mdast'
import { Markdown } from 'squirrel-x'
import type { SlotsType, VNode } from 'vue'
import { defineComponent } from 'vue'

import baseText from './base.md?raw'
import CodeDemo from './CodeDemo'

type Slots = SlotsType<{
  default?: () => VNode
}>
type Emits = {}

type Props = {}

const App = defineComponent<Props, Emits, string, Slots>((props, ctx) => {
  return () => {
    return (
      <div class="min-w-240 flex justify-center p-5">
        <Markdown
          class="flex-1"
          content={baseText}
          v-slots={{
            customRender: ({ ast }: { ast: RootContent }) => {
              if (ast.type === 'html') {
                return <CodeDemo html={ast.value} />
              }
            },
          }}
        />
      </div>
    )
  }
}, {
  props: [],
})

export default App
