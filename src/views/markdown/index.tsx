import type { SlotsType, VNode } from 'vue'
import { defineComponent } from 'vue'

import CodePreview from '@/components/ui/CodePreview'

import baseText from './base.md?raw'

const modules = import.meta.glob('./demos/*.(vue|tsx)', { eager: true, import: 'default' })
const modulesCode: Record<string, string> = import.meta.glob('./demos/*.(vue|tsx|md)', { eager: true, query: '?raw', import: 'default' })

type Slots = SlotsType<{
  default?: () => VNode
}>
type Emits = {}

type Props = {}

const App = defineComponent<Props, Emits, string, Slots>((props, ctx) => {
  return () => {
    return (
      <div class="min-w-240 flex justify-center p-5">
        <CodePreview
          markdown={baseText}
          modules={modules}
          modulesCode={modulesCode}
        />
      </div>
    )
  }
}, {
  props: [],
})

export default App
