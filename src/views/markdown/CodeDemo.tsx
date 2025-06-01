import { Code, Tabs } from 'squirrel-x'
import type { SlotsType, VNode } from 'vue'
import { defineComponent, h, ref } from 'vue'

import { cn } from '@/utils'

const modules = import.meta.glob('./demos/*.(vue|tsx)', { eager: true, import: 'default' })
const modulesCode: Record<string, string> = import.meta.glob('./demos/*.(vue|tsx|md)', { eager: true, query: '?raw', import: 'default' })

type Slots = SlotsType<{
  default?: () => VNode
}>
type Emits = {}

type Props = {
  src: string
  markdown?: string
  showcode?: string
}

const CodeDemo = defineComponent<Props, Emits, string, Slots>((props, ctx) => {
  const tabKey = ref('preview')

  return () => {
    const component = modules[props.src]
    if (!component) return null
    const markdownContent = modulesCode[props.markdown ?? ''] || ''
    const tabCodeList = props.showcode?.split(',').filter((name) => {
      return modulesCode[`./demos/${name}`]
    }).map((name) => {
      return {
        label: name,
        value: name,
      }
    }) ?? []
    return (
      <div
        class={[
          'b-solid b-1px b-black rounded-md',
        ]}
      >
        <Tabs
          type="card"
          value={tabKey.value}
          onUpdate:value={v => tabKey.value = v}
          items={[
            { label: '预览', value: 'preview' },
            { label: '代码', value: 'code' },
            ...markdownContent ? [{ label: 'markdown', value: 'markdown' }] : [],
            ...tabCodeList,

          ]}
        />
        <div class="p-2">
          <div class={cn(tabKey.value === 'preview' ? 'block' : 'hidden')}>
            {component && h(component, { markdown: markdownContent })}
          </div>

          <div class={cn(tabKey.value === 'markdown' ? 'block' : 'hidden')}>
            <Code
              toolbar={true}
              showLineNum={false}
              code={markdownContent || ''}
              language="markdown"
            />
          </div>

          <div class={cn(['preview', 'markdown'].includes(tabKey.value) ? 'hidden' : 'block')}>
            <Code
              toolbar={true}
              showLineNum={false}
              code={modulesCode[`./demos/${tabKey.value}`] || modulesCode[props.src] || ''}
              language="vue"
            />
          </div>
        </div>

      </div>
    )
  }
}, {
  props: ['src', 'markdown', 'showcode'],
})

export default CodeDemo
