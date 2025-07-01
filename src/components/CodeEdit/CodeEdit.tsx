import type { Extension } from '@codemirror/state'
import { Annotation, StateEffect } from '@codemirror/state'
import type { ViewUpdate } from '@codemirror/view'
import { EditorView } from '@codemirror/view'
import type { SlotsType } from 'vue'
import { defineComponent, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'

import { cn, isArrayEmpty, safeArray } from '@/utils'

type CodeEditSlots = {}
export type CodeEditEmits = {
  'update:value': (value: string) => void
  'focus': () => void
  'blur': () => void
  'click': () => void
}
export type CodeEditProps = {
  value?: string
  extensions?: Extension[]
  class?: string
}

export type CodeInsertFun = (params: { from: number, to?: number, value: string }) => void

const CodeEdit = defineComponent<CodeEditProps, CodeEditEmits, string, SlotsType<CodeEditSlots>>((props, ctx) => {
  const refCodeEditEle = ref<HTMLElement>()
  let editorView: EditorView | null = null

  const External = Annotation.define<boolean>()

  const updateListener = EditorView.updateListener.of((vu: ViewUpdate) => {
    if (vu.docChanged && !vu.transactions.some(tr => tr.annotation(External))) {
      const value = vu.state.doc.toString()
      ctx.emit('update:value', value)
    }
  })

  const getDefaultExtension = () => {
    return [
      updateListener,
    ]
  }

  let initialExtensions = false

  const loadExtension = (view = editorView) => {
    if (!view) return
    const extensions = safeArray(props.extensions)

    if (!extensions.length) return

    const defaultExtensions = getDefaultExtension()
    const curExtensions = [
      ...extensions,
      ...defaultExtensions,
    ]

    view.dispatch({
      effects: StateEffect.reconfigure.of(curExtensions),
    })
  }

  watch(() => props.extensions, (extensions) => {
    if (!initialExtensions || isArrayEmpty(extensions)) return
    loadExtension()
  }, {})

  watch([() => props.value], ([val]) => {
    if (!editorView || val === undefined) return

    const curVal = editorView.state.doc.toString()
    if (val !== curVal) {
      editorView.dispatch({
        changes: { from: 0, to: curVal.length, insert: val },
      })
    }
  })

  const handleEventFocus = () => {
    ctx.emit('focus')
  }

  const handleEventBlur = () => {
    ctx.emit('blur')
  }

  const handleEventClick = () => {
    ctx.emit('click')
  }

  const insert: CodeInsertFun = (params) => {
    editorView?.dispatch({
      changes: params,
    })
  }

  ctx.expose(insert)

  onMounted(async () => {
    if (!refCodeEditEle.value) return
    editorView = new EditorView({
      extensions: getDefaultExtension(),
      parent: refCodeEditEle.value,
      doc: props.value || '',
    })

    await nextTick()
    loadExtension(editorView)
    initialExtensions = true

    editorView.contentDOM.addEventListener('focus', handleEventFocus)
    editorView.contentDOM.addEventListener('blur', handleEventBlur)
    editorView.contentDOM.addEventListener('click', handleEventClick)
  })

  onUnmounted(() => {
    if (!editorView) return
    editorView.contentDOM.removeEventListener('focus', handleEventFocus)
    editorView.contentDOM.removeEventListener('blur', handleEventBlur)
    editorView.contentDOM.removeEventListener('click', handleEventClick)
    editorView.destroy?.()
    editorView = null
  })

  return () => {
    return (
      <div
        ref={refCodeEditEle}
        class={cn(
          props.class,
        )}
      >
      </div>
    )
  }
}, {
  props: ['value', 'extensions', 'class'],
  inheritAttrs: false,
})

export default CodeEdit
