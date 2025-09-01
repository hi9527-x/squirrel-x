import type { EditorState } from '@codemirror/state'
import type { EditorView } from '@codemirror/view'
import type { InjectionKey, MaybeRef } from 'vue'
import { inject } from 'vue'

import type { MaybeUndefinedRefOrGetter } from './Types'

type CodeEditStore = {
  state?: MaybeUndefinedRefOrGetter<EditorState>
  view?: MaybeUndefinedRefOrGetter<EditorView>
}

export const codeEditStoreKey = Symbol('codeEditStore') as InjectionKey<CodeEditStore>

export function useCodeStore() {
  const store = inject(codeEditStoreKey)
  return {
    state: store?.state,
    view: store?.view,
  }
}
