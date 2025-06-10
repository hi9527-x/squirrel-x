import { watchDebounced } from '@vueuse/core'
import type { Root } from 'hast'
import remarkParse from 'remark-parse'
import type { Options as RemarkRehypeOptions } from 'remark-rehype'
import remarkRehype from 'remark-rehype'
import type { PluggableList } from 'unified'
import { unified } from 'unified'
import type { SlotsType } from 'vue'
import { defineComponent, shallowRef } from 'vue'

import type { Md2VnodeProps, Md2VnodeSlots } from './Md2Vnode'
import Md2Vnode from './Md2Vnode'

type VueMarkdownSlots = Md2VnodeSlots
type VueMarkdownEmits = {}

const emptyRemarkRehypeOptions = { allowDangerousHtml: true }

type Options = {
  rehypePlugins: PluggableList
  remarkPlugins: PluggableList
  remarkRehypeOptions: RemarkRehypeOptions
}

function createProcessor(options?: Partial<Options>) {
  const rehypePlugins = options?.rehypePlugins || []
  const remarkPlugins = options?.remarkPlugins || []
  const remarkRehypeOptions = { ...options?.remarkRehypeOptions ?? {}, ...emptyRemarkRehypeOptions }

  const processor = unified()
    .use(remarkParse)
    .use(remarkPlugins)
    .use(remarkRehype, remarkRehypeOptions)
    .use(rehypePlugins)

  return processor
}

export type VueMarkdownProps = Partial<Options> & {
  content?: string
} & Omit<Md2VnodeProps, 'hast'>

const VueMarkdown = defineComponent<VueMarkdownProps, VueMarkdownEmits, string, SlotsType<VueMarkdownSlots>>((props, ctx) => {
  const hast = shallowRef<Root>()
  watchDebounced([
    () => props.content,
    () => props.rehypePlugins,
    () => props.remarkPlugins,
    () => props.remarkRehypeOptions,
  ], async ([content, rehypePlugins, remarkPlugins, remarkRehypeOptions], [oldContent]) => {
    if (!content || content === oldContent) return
    const processor = createProcessor({ rehypePlugins, remarkPlugins, remarkRehypeOptions })
    hast.value = await processor.run(processor.parse(content || ''))
  }, {
    immediate: true,
    debounce: 50,
    maxWait: 100,
  })
  return () => {
    return (
      <Md2Vnode
        disallowedElements={props.disallowedElements}
        hast={hast.value}
        v-slots={ctx.slots}
      />
    )
  }
}, {
  props: ['rehypePlugins', 'remarkPlugins', 'remarkRehypeOptions', 'content', 'disallowedElements'],
})

export default VueMarkdown
