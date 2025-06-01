import { watchDebounced } from '@vueuse/core'
import type { KatexOptions } from 'katex'
import type { SlotsType } from 'vue'
import { defineComponent, ref } from 'vue'

import generateCode2Math from '@/utils/generateCode2Math'

type KatexSlots = SlotsType<{}>
type KatexEmits = {}
export type KatexProps = {
  tex?: string
  options?: KatexOptions
}

const KatexRender = defineComponent<KatexProps, KatexEmits, string, KatexSlots>((props) => {
  const renderHTML = ref('')

  watchDebounced(() => props.tex, (tex, oldContent) => {
    if (!tex || tex === oldContent) return

    const html = generateCode2Math(tex, {
      output: 'mathml',
      ...props.options ?? {},
    })
    if (html && renderHTML.value !== html) {
      renderHTML.value = html
    }
  }, {
    immediate: true,
    debounce: 50,
    maxWait: 60,
  })

  return () => {
    const displayMode = props.options?.displayMode !== false
    if (!displayMode) return <span v-html={renderHTML.value}></span>
    return (
      <div v-html={renderHTML.value}>

      </div>
    )
  }
}, {
  props: ['options', 'tex'],
})

export default KatexRender
