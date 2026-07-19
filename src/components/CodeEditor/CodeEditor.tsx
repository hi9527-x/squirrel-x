import type { Extension } from '@codemirror/state'
import { EditorState } from '@codemirror/state'
import type { ViewUpdate } from '@codemirror/view'
import { EditorView, placeholder } from '@codemirror/view'
import type { SlotsType } from 'vue'
import { computed, defineComponent, ref } from 'vue'

import { cn, safeArray } from '@/utils'

import type { UseCodeMirror } from './Types'
import { useCodeMirror } from './useCodeMirror'

type CodeEditorSlots = {}
export type CodeEditorEmits = {
  'update:value': (value: string) => void
  'update': (viewUpdate: ViewUpdate) => void
  'focus': () => void
  'blur': () => void
  'click': () => void
  'loaded': (editorView: EditorView) => void
}
export type CodeEditorProps = {
  value?: string
  extensions?: Extension[]

  placeholder?: string
  readOnly?: boolean
  editable?: boolean
  class?: string
}

export type CodeEditorInsertParams = { from: number, to?: number, value: string }
export type CodeEditorReplaceParams = { from: number, to: number, value: string }
export type CodeEditorExpose = {
  getEditorView: () => EditorView | null
  focus: () => void
  blur: () => void
  insert: (params: CodeEditorInsertParams) => void
  replace: (params: CodeEditorReplaceParams) => void
  clear: () => void
}

const CodeEditor = defineComponent<CodeEditorProps, CodeEditorEmits, string, SlotsType<CodeEditorSlots>>((props, ctx) => {
  const refCodeEditorEle = ref<HTMLElement>()

  // 把 placeholder / readOnly / editable 这些"业务扩展"拼进 extensions，
  // useCodeMirror 只负责 value + extensions + callbacks 三件事。
  const innerExtensions = computed<Extension[]>(() => {
    const list: (Extension | null | false)[] = [
      ...safeArray(props.extensions),
      props.placeholder ? placeholder(props.placeholder) : null,
      EditorState.readOnly.of(!!props.readOnly),
      EditorView.editable.of(props.editable !== false),
    ]
    return list.filter(Boolean) as Extension[]
  })

  const cmProps: UseCodeMirror = {
    value: () => props.value,
    extensions: innerExtensions,
    // syncState: false,
    container: refCodeEditorEle,
    onCreateEditor: editorView => ctx.emit('loaded', editorView),
    onChange: value => ctx.emit('update:value', value),
    onUpdate: (vu) => {
      ctx.emit('update', vu)
      if (vu.focusChanged) {
        if (vu.view.hasFocus) {
          ctx.emit('focus')
        }
        else {
          ctx.emit('blur')
        }
      }
    },
  }

  const { view, dispatchExternal } = useCodeMirror(cmProps)

  ctx.expose({
    getEditorView: () => view.value ?? null,
    focus: () => view.value?.focus(),
    blur: () => view.value?.contentDOM.blur(),
    insert: ({ from, to, value }: CodeEditorInsertParams) => {
      dispatchExternal({ from, to: to ?? from, insert: value })
    },
    replace: ({ from, to, value }: CodeEditorReplaceParams) => {
      dispatchExternal({ from, to, insert: value })
    },
    clear: () => {
      const v = view.value
      if (!v) return
      dispatchExternal({ from: 0, to: v.state.doc.length, insert: '' })
    },
  } satisfies CodeEditorExpose)

  return () => {
    return (
      <div
        ref={refCodeEditorEle}
        class={cn(
          props.class,
        )}
        onClick={() => ctx.emit('click')}
      >
      </div>
    )
  }
}, {
  props: ['value', 'extensions', 'placeholder', 'readOnly', 'editable', 'class'],
  inheritAttrs: false,
})

export default CodeEditor
