import { isString } from 'es-toolkit'
import rehypeParse from 'rehype-parse'
import { Code, Tabs } from 'squirrel-x'
import { unified } from 'unified'
import type { SlotsType, VNode } from 'vue'
import { defineComponent, h, onMounted, ref } from 'vue'

import { cn } from '@/utils'

const modules = import.meta.glob('./demos/*.(vue|tsx)', { eager: true, import: 'default' })
const modulesCode: Record<string, string> = import.meta.glob('./demos/*.(vue|tsx|md)', { eager: true, query: '?raw', import: 'default' })

type Slots = SlotsType<{
  default?: () => VNode
}>
type Emits = {}

type Props = {
  html?: string
}

const CodeDemo = defineComponent<Props, Emits, string, Slots>((props, ctx) => {
  const demoPath = ref('')
  const markdownContent = ref('')
  const showCode = ref('')
  onMounted(async () => {
    const ast = unified()
      .use(rehypeParse, { fragment: true })
      .parse(props.html || '')

    const codeDom = ast.children?.[0]

    if (codeDom.type === 'element' && codeDom.tagName === 'code') {
      demoPath.value = isString(codeDom.properties.src) ? codeDom.properties.src : ''

      if (isString(codeDom.properties.markdown) && modulesCode[codeDom.properties.markdown]) {
        markdownContent.value = modulesCode[codeDom.properties.markdown]
      }

      showCode.value = isString(codeDom.properties.showcode) ? codeDom.properties.showcode : ''
    }
  })

  const tabKey = ref('preview')

  return () => {
    const component = modules[demoPath.value]
    if (!component) return null

    const tabCodeList = showCode.value.split(',').filter((name) => {
      return modulesCode[`./demos/${name}`]
    }).map((name) => {
      return {
        label: name,
        value: name,
      }
    })
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
            ...markdownContent.value ? [{ label: 'markdown', value: 'markdown' }] : [],
            ...tabCodeList,

          ]}
        />
        <div class="p-2">
          <div class={cn(tabKey.value === 'preview' ? 'block' : 'hidden')}>
            {component && h(component, { markdown: markdownContent.value })}
          </div>

          <div class={cn(tabKey.value === 'markdown' ? 'block' : 'hidden')}>
            <Code
              toolbar={true}
              showLineNum={false}
              code={markdownContent.value || ''}
              language="markdown"
            />
          </div>

          <div class={cn(['preview', 'markdown'].includes(tabKey.value) ? 'hidden' : 'block')}>
            <Code
              toolbar={true}
              showLineNum={false}
              code={modulesCode[`./demos/${tabKey.value}`] || modulesCode[demoPath.value] || ''}
              language="vue"
            />
          </div>
        </div>

      </div>
    )
  }
}, {
  props: ['html'],
})

export default CodeDemo
