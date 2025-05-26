import type { SlotsType, VNode } from 'vue'
import { defineComponent } from 'vue'

import { cn } from '@/utils'
import IconInbox from '~icons/lucide/inbox'

type EmptySlots = SlotsType<{
  description?: () => VNode[]
}>
type EmptyEmits = {}

export type EmptyProps = {
  description?: string
}

const Empty = defineComponent<EmptyProps, EmptyEmits, string, EmptySlots>((props, ctx) => {
  return () => {
    return (
      <div
        class={cn(
          'text-3 m-inline-2 text-center',
        )}
      >
        <div class="m-b-2 h-25 flex items-center justify-center">
          <IconInbox class="text-12 text-zinc-600" />
        </div>
        {ctx.slots?.description?.() ?? <p class="text-3 text-zinc-600">{props.description || '暂无数据'}</p>}
      </div>
    )
  }
}, {
  props: ['description'],
})

export default Empty
