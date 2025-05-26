import { watchDebounced } from '@vueuse/core'
import type { SlotsType } from 'vue'
import { defineComponent, ref } from 'vue'

import { generateCode2Math } from './utils'

type KatexSlots = SlotsType<{}>
type KatexEmits = {}
type Props = {
  content?: string
  type: 'inline' | 'block'
}

const KatexRender = defineComponent<Props, KatexEmits, string, KatexSlots>((props) => {
  const renderHTML = ref('')

  watchDebounced(() => props.content, (content, oldContent) => {
    if (!content || content === oldContent) return

    const html = generateCode2Math(content, {
      displayMode: props.type === 'block',
    })
    if (html && renderHTML.value !== html) {
      renderHTML.value = html
    }
  }, {
    immediate: true,
    debounce: 100,
    maxWait: 120,
  })

  return () => {
    if (props.type === 'inline') return <span v-html={renderHTML.value}></span>
    return (
      <div v-html={renderHTML.value}>

      </div>
    )
  }
}, {
  props: ['type', 'content'],
})

export default KatexRender
