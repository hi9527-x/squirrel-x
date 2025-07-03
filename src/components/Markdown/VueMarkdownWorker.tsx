import { watchDebounced } from '@vueuse/core'
import type { Root } from 'hast'
import { nanoid } from 'nanoid'
import type { SlotsType, VNode } from 'vue'
import { defineComponent, onMounted, onUnmounted, shallowRef } from 'vue'

import type { HRoot } from '..'
import type { VueMdWorkerParams } from './common'
import { getMd2hastWorkerInstance } from './common'
import type { MarkdownToVnodeProps, MarkdownToVnodeSlots } from './MarkdownToVnode'
import MarkdownToVnode from './MarkdownToVnode'

export type VueMarkdownWorkerSlots = MarkdownToVnodeSlots & {
  fallback?: (params: { error: Error }) => VNode[]
}
type VueMarkdownWorkerEmits = {}

type VueMarkdownWorkerProps = Omit<VueMdWorkerParams, 'uid'> & Omit<MarkdownToVnodeProps, 'hast'> & {}

type MsgEventData = ({ error: null, hast: Root, uid: string } | { error: Error, hast: null, uid: null })

// 没有自定义插件，加个简单的缓存
const md2hastTreeCache: Record<string, HRoot> = {}

const VueMarkdownWorker = defineComponent<VueMarkdownWorkerProps, VueMarkdownWorkerEmits, string, SlotsType<VueMarkdownWorkerSlots>>((props, ctx) => {
  const hast = shallowRef<Root>()
  const error = shallowRef<Error>()
  const curUid = nanoid()

  const handleMd2Hast = (event: MessageEvent<MsgEventData>) => {
    const { error: err, hast: tree, uid } = event.data
    if (err) {
      error.value = err
      return
    }

    if (uid === curUid) {
      hast.value = tree
    }
  }

  const markdownToHast = getMd2hastWorkerInstance()

  onMounted(() => {
    markdownToHast.addEventListener('message', handleMd2Hast)
  })

  onUnmounted(() => {
    markdownToHast.removeEventListener('message', handleMd2Hast)
  })

  watchDebounced([
    () => props.content,
    () => props.remarkRehypeOptions,
  ], async ([content, remarkRehypeOptions]) => {
    if (!content || !markdownToHast) return

    if (md2hastTreeCache[content]) {
      hast.value = md2hastTreeCache[content]
      return
    }

    markdownToHast.postMessage({ content, remarkRehypeOptions, uid: curUid })
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
