import { Code, Tabs } from 'squirrel-x'
import type { SlotsType, VNode } from 'vue'
import { defineComponent, ref } from 'vue'

import { cn } from '@/utils'

type Slots = {
  default?: () => VNode[]
}
type Emits = {}

type Props = {
  tabsCodeList?: {
    label: string
    lang: string
    code: string
  }[]
}

const Preview = defineComponent<Props, Emits, string, SlotsType<Slots>>((props, ctx) => {
  const actionKey = ref('preview')
  return () => {
    const codeShow = props.tabsCodeList?.[Number(actionKey.value)]

    return (
      <div class={cn(
        'b b-solid b-gray-200 rounded-md inline-block min-w-900px',
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
          {codeShow && (
            <div class="bg-gray-500 bg-white">
              <Code
                code={codeShow.code}
                language={codeShow.lang}
              />
            </div>
          )}
        </div>
      </div>
    )
  }
}, {
  props: ['tabsCodeList'],
  inheritAttrs: false,
})

export default Preview
