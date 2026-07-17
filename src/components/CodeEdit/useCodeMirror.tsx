import type { Extension } from '@codemirror/state'
import { Annotation, Compartment, EditorState } from '@codemirror/state'
import type { ViewUpdate } from '@codemirror/view'
import { EditorView } from '@codemirror/view'
import { onUnmounted, shallowRef, toValue, watch } from 'vue'

import { safeArray } from '@/utils'

import type { UseCodeMirror } from './Types'

// 模块级注解：用于标记"外部触发"事务的共享身份标签。
// 跨实例安全 —— 事务不会跨越 EditorView 边界。
const External = Annotation.define<boolean>()

export function useCodeMirror(props: UseCodeMirror) {
  const state = shallowRef<EditorState>()
  const view = shallowRef<EditorView>()

  const extensionsCompartment = new Compartment()

  const buildUserExtensions = (): Extension[] => safeArray(toValue(props.extensions))

  const updateListener = EditorView.updateListener.of((vu: ViewUpdate) => {
    props.onUpdate?.(vu)

    if (toValue(props.syncState) !== false) {
      state.value = vu.state
    }

    if (vu.docChanged && !vu.transactions.some(tr => tr.annotation(External))) {
      const value = vu.state.doc.toString()
      props.onChange?.(value, vu)
    }
  })

  const getDefaultExtensions = (): Extension[] => {
    return [updateListener]
  }

  const createEditor = (container?: HTMLElement) => {
    if (view.value) return
    if (!(container instanceof HTMLElement)) {
      if (import.meta.env.DEV) {
        console.warn('[useCodeMirror] container is missing, editor not initialized.')
      }
      return
    }

    const initialExtensions: Extension[] = [
      extensionsCompartment.of(buildUserExtensions()),
      ...getDefaultExtensions(),
    ]

    const editorState = EditorState.create({
      doc: toValue(props.value) ?? '',
      extensions: initialExtensions,
    })

    const editorView = new EditorView({
      state: editorState,
      parent: container,
    })

    view.value = editorView
    state.value = editorState
    props.onCreateEditor?.(editorView, editorState)
  }

  watch(() => toValue(props.container), (container) => {
    // container 变化时若已有 view，先销毁再重建，避免 view 残留在旧 DOM 上
    if (view.value) {
      view.value.destroy()
      view.value = undefined
      state.value = undefined
    }
    createEditor(container as HTMLElement | undefined)
  }, { immediate: true })

  watch(() => toValue(props.extensions), () => {
    const v = view.value
    if (!v) return
    v.dispatch({
      effects: extensionsCompartment.reconfigure(buildUserExtensions()),
    })
  }, { deep: true })

  watch(() => toValue(props.value), (value) => {
    const v = view.value
    if (!v || value === undefined) return

    const curVal = v.state.doc.toString()
    if (value !== curVal) {
      v.dispatch({
        annotations: External.of(true),
        changes: { from: 0, to: curVal.length, insert: value },
      })
    }
  })

  const dispatchExternal = (changes: { from: number, to?: number, insert: string }) => {
    const v = view.value
    if (!v) return
    v.dispatch({
      annotations: External.of(true),
      changes,
    })
  }

  onUnmounted(() => {
    const v = view.value
    if (v) {
      v.destroy()
      props.onDestroyEditor?.()
    }
    view.value = undefined
    state.value = undefined
  })

  return {
    state,
    view,
    dispatchExternal,
  }
}
