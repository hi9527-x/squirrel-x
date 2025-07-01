import { autocompletion, closeBrackets } from '@codemirror/autocomplete'
import { defaultKeymap, indentWithTab } from '@codemirror/commands'
import { markdown } from '@codemirror/lang-markdown'
import type { LanguageSupport } from '@codemirror/language'
import { bracketMatching, LanguageDescription } from '@codemirror/language'
import { languages } from '@codemirror/language-data'
import type { Extension } from '@codemirror/state'
import { EditorState } from '@codemirror/state'
import { EditorView, keymap, lineNumbers, placeholder } from '@codemirror/view'
import type { SlotsType } from 'vue'
import { defineComponent, shallowRef, watch } from 'vue'

import { cn } from '@/utils'

import type { CodeEditEmits, CodeEditProps } from './CodeEdit'
import CodeEdit from './CodeEdit'
import type { ThemeSizeParams } from './extensions'
import { codeDefaultTheme, githubLightTheme } from './extensions'

type CodeEditProSlots = {}
type CodeEditProEmits = CodeEditEmits & {}
type CodeEditProProps = CodeEditProps & {
  languages?: string
  class?: string
  size?: Partial<ThemeSizeParams>
  placeholder?: string
  lineNumber?: boolean
  lineWrapping?: boolean
  bracketMatch?: boolean
  readOnly?: boolean
}

// const languageNames = languages.map(it => it.name)

const CodeEditPro = defineComponent<CodeEditProProps, CodeEditProEmits, string, SlotsType<CodeEditProSlots>>((props, ctx) => {
  const languageExt = shallowRef<LanguageSupport>()

  watch(() => props.languages, async (language) => {
    if (!language) return
    const found = LanguageDescription.matchLanguageName(languages, language, true)
    if (found instanceof LanguageDescription) {
      const name = found.name.toLowerCase()

      if (name === 'markdown') {
        languageExt.value = markdown({
          codeLanguages: languages,
        })
      }
      else {
        languageExt.value = await found.load()
      }
    }
  }, {
    immediate: true,
  })

  return () => {
    const extensions: Extension[] = []

    if (languageExt.value) {
      extensions.push(languageExt.value)
    }

    if (Array.isArray(props.extensions)) {
      extensions.push(...props.extensions)
    }

    if (props.lineNumber) {
      extensions.push(lineNumbers())
    }

    if (props.lineWrapping) {
      extensions.push(EditorView.lineWrapping)
    }

    if (props.bracketMatch) {
      extensions.push(bracketMatching())
    }

    if (props.placeholder) {
      extensions.push(placeholder(props.placeholder))
    }

    if (props.readOnly) {
      extensions.push(EditorState.readOnly.of(true))
    }

    const size = {
      ...props.size ?? {},
      height: props.size?.height || '100%',
    }
    extensions.push(keymap.of([
      ...defaultKeymap,
      indentWithTab,
    ]))
    extensions.push(closeBrackets())
    extensions.push(autocompletion())
    extensions.push(codeDefaultTheme(size))
    extensions.push(githubLightTheme())

    return (
      <div
        class={cn(
          'rounded-6px b-1px b-zinc-200 b-solid',
          'overflow-auto',
          props.class,
        )}
      >
        <CodeEdit
          class="h-full"
          value={props.value}
          extensions={extensions}
          onUpdate:value={(v) => { ctx.emit('update:value', v) }}

        />
      </div>
    )
  }
}, {
  props: ['value', 'extensions', 'languages', 'class', 'size', 'placeholder', 'lineNumber', 'lineWrapping'],
  inheritAttrs: false,
})

export default CodeEditPro
