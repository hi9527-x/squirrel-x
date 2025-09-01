import type { EditorState, Extension } from '@codemirror/state'
import type { EditorView, ViewUpdate } from '@codemirror/view'
import type { MaybeRefOrGetter, Ref, VNode, VNodeChild } from 'vue'

type RefsOrGetters<T> = {
  [P in keyof T]: MaybeRefOrGetter<T[P]>;
}

export type MaybeUndefinedRefOrGetter<T> = MaybeRefOrGetter<T | undefined>

export type VueCodeMirrorProps = Partial<{
  extensions: MaybeUndefinedRefOrGetter<Extension[]>

  value: MaybeUndefinedRefOrGetter<string>
  placeholder: MaybeUndefinedRefOrGetter<string>
  readOnly: MaybeUndefinedRefOrGetter<boolean>

  height: MaybeUndefinedRefOrGetter<string>
  minHeight: MaybeUndefinedRefOrGetter<string>
  maxHeight: MaybeUndefinedRefOrGetter<string>

  onCreateEditor: (view: EditorView, state: EditorState) => void
  onChange: (value: string, viewUpdate: ViewUpdate) => void
  onUpdate: (viewUpdate: ViewUpdate) => void
}>

export type UseCodeMirror = VueCodeMirrorProps & Partial<{
  container?: Ref<HTMLDivElement | undefined>
}>

export type CodeEditCodeBlock = {
  uid: string
  dom: HTMLElement
  code: string
  language: string
  vnode: VNodeChild
}

type CodeEditCodeBlockSlot = (params: { code: string, language: string }) => VNodeChild
