import { Code, Tabs } from 'squirrel-x'
import type { SlotsType, VNode } from 'vue'
import { defineComponent, ref } from 'vue'

import { cn } from '@/utils'

type Slots = SlotsType<{
  default?: () => VNode[]
}>
type Emits = {}

type Props = {
  tabsCodeList?: {
    label: string
    lang: string
    code: string
  }[]
}

const Preview = defineComponent<Props, Emits, string, Slots>((props, ctx) => {
  const actionKey = ref('preview')
  return () => {
    const codeShow = props.tabsCodeList?.[Number(actionKey.value)]
    return (
      <div>
        <div class={cn(
          'b b-solid b-gray-200 rounded-md inline-block min-w-600px',
        )}
        >
          <Tabs
            type="card"
            v-model:value={actionKey.value}
            items={[
              { label: '预览', value: 'preview' },
              ...props.tabsCodeList?.map((it, idx) => {
                return {
                  label: it.label,
                  value: idx.toString(),
                }
              }) ?? [],
            ]}
          />
          <div class="">
            {actionKey.value === 'preview' && <div class="p-4">{ctx.slots?.default?.()}</div>}
            {codeShow && <div class="bg-[--bgColor-muted]"><Code code={codeShow.code} language={codeShow.lang} /></div>}
          </div>
        </div>
      </div>
    )
  }
}, {
  props: ['tabsCodeList'],
})

export default Preview
