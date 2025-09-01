import { Annotation, EditorState, StateEffect } from '@codemirror/state'
import type { ViewUpdate } from '@codemirror/view'
import { EditorView, placeholder } from '@codemirror/view'
import { onMounted, onUnmounted, shallowRef, toValue, watch } from 'vue'

import { safeArray } from '@/utils'

import { codeDefaultTheme } from './extensions'
import type { UseCodeMirror } from './Types'

export function useCodeMirror(props: UseCodeMirror) {
  const state = shallowRef<EditorState>()

  const setState = (params: typeof state.value) => {
    state.value = params
  }
  const view = shallowRef<EditorView>()

  const External = Annotation.define<boolean>()
  const updateListener = EditorView.updateListener.of((vu: ViewUpdate) => {
    if (typeof props.onChange !== 'function') return
    if (vu.docChanged && !vu.transactions.some(tr => tr.annotation(External))) {
      const value = vu.state.doc.toString()
      props.onChange?.(value, vu)
    }
  })

  const getDefaultExtension = () => {
    const placeholderText = toValue(props.placeholder)
    return [
      EditorState.readOnly.of(!!toValue(props.readOnly)),
      updateListener,
      codeDefaultTheme({
        height: toValue(props.height),
        minHeight: toValue(props.minHeight),
        maxHeight: toValue(props.maxHeight),
      }),
      ...placeholderText ? [placeholder(placeholderText)] : [],
    ]
  }

  const loadExtension = () => {
    if (!view.value) return

    const extensions = safeArray(toValue(props.extensions))

    const defaultExtensions = getDefaultExtension()
    const curExtensions = [
      ...extensions,
      ...defaultExtensions,
    ]

    view.value.dispatch({
      effects: StateEffect.reconfigure.of(curExtensions),
    })
  }

  let initialExtensions = false

  const createEditor = async (container?: HTMLDivElement) => {
    if (view.value) return
    if (!(container instanceof HTMLElement)) {
      return
    }

    const editorState = EditorState.create({
      doc: toValue(props.value),
      extensions: getDefaultExtension(),
    })

    const editorView = new EditorView({
      state: editorState,
      parent: container,

    })

    view.value = editorView
    state.value = editorState
    loadExtension()
    initialExtensions = true
    props.onCreateEditor?.(editorView, editorState)
  }

  watch([() => toValue(props.container)], ([container]) => {
    createEditor(container)
  }, {
    immediate: true,
  })

  watch([
    () => toValue(props.extensions),
    () => toValue(props.height),
    () => toValue(props.minHeight),
    () => toValue(props.maxHeight),
    () => toValue(props.placeholder),
  ], () => {
    if (!initialExtensions) return
    loadExtension()
  }, {})

  watch(() => toValue(props.value), (value) => {
    if (!view.value || typeof value !== 'string' || !value) return

    const curVal = view.value.state.doc.toString()
    if (value !== curVal) {
      view.value.dispatch({
        changes: { from: 0, to: curVal.length, insert: value },
      })
    }
  })

  onUnmounted(() => {
    if (view.value) {
      view.value.destroy()
      view.value = undefined
      state.value = undefined
    }
  })

  return {
    state,
    setState,
    view,
  }
}
