import { toJsxRuntime } from 'hast-util-to-jsx-runtime'
import rehypeRaw from 'rehype-raw'
import remarkGemoji from 'remark-gemoji'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { Markdown, Mermaid } from 'squirrel-x'
import { unified } from 'unified'
import type { SlotsType, VNode } from 'vue'
import { defineComponent, Fragment, h } from 'vue'

import content from './markdown.md?raw'

type Slots = SlotsType<{
  default?: () => VNode
}>
type Emits = {}

type Props = {}

const Test = defineComponent<Props, Emits, string, Slots>((props, ctx) => {
  return () => {
    return (
      <div class="p4">
        <Markdown
          content={content}
          v-slots={{
            code: ({ code, language }) => {
              if (language === 'mermaid') {
                return <Mermaid code={code} />
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

export default Test
