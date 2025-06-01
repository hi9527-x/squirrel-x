import type { SlotsType, VNode } from 'vue'
import { defineComponent, h } from 'vue'

import CodePreview from '@/components/ui/CodePreview'

import demo from './demo.md?raw'

const modules = import.meta.glob('./demos/*.(vue|tsx)', { eager: true, import: 'default' })
const modulesCode: Record<string, string> = import.meta.glob('./demos/*.(vue|tsx|md)', { eager: true, query: '?raw', import: 'default' })

type Slots = SlotsType<{
  default?: () => VNode
}>
type Emits = {}

type Props = {}

const MermaidDemo = defineComponent<Props, Emits, string, Slots>((props, ctx) => {
  return () => {
    return (
      <div class="p-4">
        <CodePreview
          markdown={demo}
          modules={modules}
          modulesCode={modulesCode}
        />
      </div>
    )
  }
}, {
  props: [],
})

export default MermaidDemo
