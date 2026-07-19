import type { EditorState } from '@codemirror/state'
import type { EditorView } from '@codemirror/view'
import type { InjectionKey, MaybeRef } from 'vue'
import { inject } from 'vue'

import type { MaybeUndefinedRefOrGetter } from './Types'

type CodeEditorStore = {
  state?: MaybeUndefinedRefOrGetter<EditorState>
  view?: MaybeUndefinedRefOrGetter<EditorView>
}

export const codeEditorStoreKey = Symbol('codeEditorStore') as InjectionKey<CodeEditorStore>

export function useCodeStore() {
  const store = inject(codeEditorStoreKey)
  return {
    state: store?.state,
    view: store?.view,
  }
}
