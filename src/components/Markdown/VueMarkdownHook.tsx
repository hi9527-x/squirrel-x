import { watchDebounced } from '@vueuse/core'
import { pick } from 'es-toolkit'
import type { Root } from 'hast'
import type { SlotsType, VNode } from 'vue'
import { defineComponent, shallowRef, watch } from 'vue'

import type { Options } from './common'
import { createProcessor } from './common'
import type { MarkdownToVnodeProps, MarkdownToVnodeSlots } from './MarkdownToVnode'
import Md2Vnode from './MarkdownToVnode'

type VueMarkdownHookSlots = MarkdownToVnodeSlots & {
  fallback?: (params: { error: Error }) => VNode[]
}
type VueMarkdownHookEmits = {}

export type VueMarkdownHookProps = Partial<Options> & {
  content?: string

} & Omit<MarkdownToVnodeProps, 'hast'>

const VueMarkdownHook = defineComponent<VueMarkdownHookProps, VueMarkdownHookEmits, string, SlotsType<VueMarkdownHookSlots>>((props, ctx) => {
  const hast = shallowRef<Root>()
  const error = shallowRef<Error>()
  const processor = shallowRef(createProcessor(pick(props, ['rehypePlugins', 'remarkPlugins', 'remarkRehypeOptions'])))

  watch([
    () => props.rehypePlugins,
    () => props.remarkPlugins,
    () => props.remarkRehypeOptions,
  ], ([rehypePlugins, remarkPlugins, remarkRehypeOptions]) => {
    processor.value = createProcessor({ rehypePlugins, remarkPlugins, remarkRehypeOptions })
  }, {
    deep: true,
  })

  watchDebounced([
    () => props.content,
    processor,
  ], async ([content, curProcessor]) => {
    if (!content) return
    error.value = undefined
    try {
      hast.value = await curProcessor.run(curProcessor.parse(content || ''))
    }
    catch (err) {
      if (err instanceof Error) {
        error.value = err
      }
    }
  }, {
    immediate: true,
    debounce: 50,
    maxWait: 100,
  })
  return () => {
    if (error.value instanceof Error) return ctx.slots?.fallback?.({ error: error.value })
    return (
      <Md2Vnode
        hast={hast.value}
        disallowedElements={props.disallowedElements}
        v-slots={ctx.slots}
      />
    )
  }
}, {
  props: ['rehypePlugins', 'remarkPlugins', 'remarkRehypeOptions', 'content', 'disallowedElements'],
})

export default VueMarkdownHook
