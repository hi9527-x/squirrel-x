import type { SlotsType, VNode } from 'vue'
import { defineComponent } from 'vue'

import CodePreview from '@/components/ui/CodePreview'

import markdown from './base.md?raw'

const modules = import.meta.glob('./demos/*.(vue|tsx)', { eager: true, import: 'default' })
const modulesCode: Record<string, string> = import.meta.glob('./demos/*.(vue|tsx|md)', { eager: true, query: '?raw', import: 'default' })

type Slots = SlotsType<{
  default?: () => VNode
}>
type Emits = {}

type Props = {}

const Math = defineComponent<Props, Emits, string, Slots>((props, ctx) => {
  return () => {
    return (
      <div class="p-4">
        <CodePreview
          markdown={markdown}
          modules={modules}
          modulesCode={modulesCode}
        />
      </div>
    )
  }
}, {
  props: [],
})

export default Math
