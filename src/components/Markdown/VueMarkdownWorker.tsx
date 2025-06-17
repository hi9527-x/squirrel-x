import { watchDebounced } from '@vueuse/core'
import type { Root } from 'hast'
import type { SlotsType, VNode } from 'vue'
import { defineComponent, onMounted, onUnmounted, shallowRef } from 'vue'

import type { VueMdWorkerParams } from './common'
import MarkdownToHast from './markdownToHast.worker?worker'
import type { MarkdownToVnodeProps, MarkdownToVnodeSlots } from './MarkdownToVnode'
import MarkdownToVnode from './MarkdownToVnode'

export type VueMarkdownWorkerSlots = MarkdownToVnodeSlots & {
  fallback?: (params: { error: Error }) => VNode[]
}
type VueMarkdownWorkerEmits = {}

type VueMarkdownWorkerProps = VueMdWorkerParams & Omit<MarkdownToVnodeProps, 'hast'> & {}

type MsgEventData = { error: null, hast: Root } | { error: Error, hast: null }

const VueMarkdownWorker = defineComponent<VueMarkdownWorkerProps, VueMarkdownWorkerEmits, string, SlotsType<VueMarkdownWorkerSlots>>((props, ctx) => {
  const hast = shallowRef<Root>()
  const error = shallowRef<Error>()

  const handleMd2Hast = (event: MessageEvent<MsgEventData>) => {
    const { error: err, hast: tree } = event.data
    if (err) {
      error.value = err
      return
    }
    hast.value = tree
  }

  let markdownToHast: Worker | null = null

  onMounted(() => {
    markdownToHast = new MarkdownToHast({ name: 'fromMdWorker' })

    markdownToHast.onmessage = handleMd2Hast
  })

  onUnmounted(() => {
    markdownToHast?.terminate()
  })

  watchDebounced([
    () => props.content,
    () => props.remarkRehypeOptions,
  ], async ([content, remarkRehypeOptions]) => {
    if (!content || !markdownToHast) return
    markdownToHast.postMessage({ content, remarkRehypeOptions })
  }, {
    immediate: true,
    debounce: 50,
    maxWait: 60,
  })

  return () => {
    if (error.value instanceof Error) return ctx.slots?.fallback?.({ error: error.value })
    return (
      <MarkdownToVnode
        hast={hast.value}
        disallowedElements={props.disallowedElements}
        v-slots={ctx.slots}
      />
    )
  }
}, {
  props: ['content', 'remarkRehypeOptions', 'disallowedElements'],
})

export default VueMarkdownWorker
