import type { SlotsType } from 'vue'
import { defineComponent } from 'vue'

import type { Options } from './common'
import { createProcessor } from './common'
import type { MarkdownToVnodeProps, MarkdownToVnodeSlots } from './MarkdownToVnode'
import Md2Vnode from './MarkdownToVnode'

type VueMarkdownSlots = MarkdownToVnodeSlots
type VueMarkdownEmits = {}

type VueMarkdownProps = Partial<Options> & {
  content?: string

} & Omit<MarkdownToVnodeProps, 'hast'>

const VueMarkdown = defineComponent<VueMarkdownProps, VueMarkdownEmits, string, SlotsType<VueMarkdownSlots>>((props, ctx) => {
  return () => {
    if (!props.content) return null
    const { rehypePlugins, remarkPlugins, remarkRehypeOptions } = props
    const processor = createProcessor({ rehypePlugins, remarkPlugins, remarkRehypeOptions })
    const hast = processor.runSync(processor.parse(props.content))
    return (
      <Md2Vnode
        hast={hast}
        disallowedElements={props.disallowedElements}
        v-slots={ctx.slots}
      />
    )
  }
}, {
  props: ['rehypePlugins', 'remarkPlugins', 'remarkRehypeOptions', 'content', 'disallowedElements'],
})

export default VueMarkdown
