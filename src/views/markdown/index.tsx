import { isString } from 'es-toolkit'
import type { Element } from 'hast'
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
          allowDangerousHtml
          class="flex-1"
          content={baseText}
          v-slots={{
            customRender: ({ ast }: { ast: Element }) => {
              if (ast.tagName === 'sx-code') {
                const properties = ast.properties
                const src = isString(properties.src) ? properties.src : ''
                if (!src) return

                const markdown = isString(properties.markdown) ? properties.markdown : ''
                const showcode = isString(properties.showcode) ? properties.showcode : ''
                return <CodeDemo src={src} markdown={markdown} showcode={showcode} />
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
