import { autocompletion, closeBrackets } from '@codemirror/autocomplete'
import { defaultKeymap, history, indentWithTab, redo, redoDepth, undo, undoDepth } from '@codemirror/commands'
import { markdown } from '@codemirror/lang-markdown'
import type { LanguageSupport } from '@codemirror/language'
import { bracketMatching, LanguageDescription } from '@codemirror/language'
import { languages } from '@codemirror/language-data'
import { closeSearchPanel, findNext, findPrevious, openSearchPanel, search, searchKeymap, SearchQuery, setSearchQuery } from '@codemirror/search'
import type { Extension } from '@codemirror/state'
import { drawSelection, EditorView, keymap, lineNumbers } from '@codemirror/view'
import { useClipboard } from '@vueuse/core'
import type { SlotsType } from 'vue'
import { computed, defineComponent, h, provide, ref, shallowRef, Teleport, toValue, watch } from 'vue'

import { Button, Input, Select } from '@/components'
import { useViewFullscreen } from '@/components/hook'
import { cn, normalizeVNodes } from '@/utils'
import IconArrowDown from '~icons/lucide/arrow-down'
import IconArrowUp from '~icons/lucide/arrow-up'
import IconCaseUpper from '~icons/lucide/case-upper'
import IconCheck from '~icons/lucide/check'
import IconCopy from '~icons/lucide/copy'
import IconExpand from '~icons/lucide/expand'
import IconRedo from '~icons/lucide/redo'
import IconRegex from '~icons/lucide/regex'
import IconSearch from '~icons/lucide/search'
import IconUndo from '~icons/lucide/undo'

import { codeBlockCustomRenderExt, githubLightTheme, panelsContainer, panelTopTheme } from './extensions'
import { codeEditStoreKey } from './store'
import type { CodeEditCodeBlock, CodeEditCodeBlockSlot, VueCodeMirrorProps } from './Types'
import { useCodeMirror } from './useCodeMirror'

export type CodeEditProSlots = {
  codeBlock?: CodeEditCodeBlockSlot
}
type CodeEditProEmits = {}
type CodeEditProProps = VueCodeMirrorProps & {
  language?: string
  onLanguageChange?: (lang: string) => void
  class?: string

  placeholder?: string
  lineNumber?: boolean
  lineWrapping?: boolean
  bracketMatch?: boolean
  readOnly?: boolean
}
const languageNames = languages.map(it => it.name)
const options = languageNames.map((name) => {
  return { label: name, value: name }
})
// const languageNames = languages.map(it => it.name)

const CodeEditPro = defineComponent<CodeEditProProps, CodeEditProEmits, string, SlotsType<CodeEditProSlots>>((props, ctx) => {
  const codeTopContainer = ref<HTMLElement>()
  const refEditorDom = ref<HTMLDivElement>()

  const { className, toggle, isFullscreen } = useViewFullscreen()

  const { copy, copied, isSupported } = useClipboard({
    copiedDuring: 1000,
  })
  const searchPanelDom = ref<HTMLDivElement>()

  const languageExt = shallowRef<LanguageSupport>()

  const codeBlockList = shallowRef<CodeEditCodeBlock[]>([])
  const handleCodeBlockChange = (params: CodeEditCodeBlock, type: 'add' | 'remove') => {
    if (type === 'add') {
      codeBlockList.value = [
        ...codeBlockList.value,
        params,
      ]
    }
    else if (type === 'remove') {
      codeBlockList.value = codeBlockList.value.filter(it => it.uid !== params.uid)
    }
  }

  const handleCodeBlock2Slot = (params: { code: string, language: string }) => {
    const vnode = normalizeVNodes(ctx.slots.codeBlock?.(params))

    if (vnode.length) {
      return vnode
    }
    return null
  }

  const extensions = computed(() => {
    const extensions: Extension[] = [
      drawSelection(),
      history(),
      search({
        createPanel(view) {
          const dom = document.createElement('div')

          return {
            top: true,
            dom,
            mount() {
              searchPanelDom.value = dom
            },
            destroy() {
              dom.remove()
              searchPanelDom.value = undefined
            },
          }
        },
      }),
      codeBlockCustomRenderExt({ onChange: handleCodeBlockChange, getVnode: handleCodeBlock2Slot }),
    ]

    if (languageExt.value) {
      extensions.unshift(languageExt.value)
    }

    if (Array.isArray(props.extensions)) {
      extensions.unshift(...props.extensions)
    }

    if (props.lineNumber) {
      extensions.unshift(lineNumbers())
    }

    if (props.lineWrapping) {
      extensions.unshift(EditorView.lineWrapping)
    }

    if (props.bracketMatch) {
      extensions.unshift(bracketMatching())
    }

    extensions.unshift(keymap.of([
      ...searchKeymap,
      ...defaultKeymap,
      indentWithTab,
    ]))
    extensions.unshift(closeBrackets())
    extensions.unshift(autocompletion())
    extensions.unshift(githubLightTheme())
    extensions.unshift(panelsContainer({ topContainer: codeTopContainer.value }))
    extensions.unshift(panelTopTheme())
    return extensions
  })

  const undoAndRedoDepth = ref({
    undo: 0,
    redo: 0,
  })

  const codeValue = ref(toValue(props.value) || '')

  const codeEditHeight = computed(() => toValue(props.height))
  const { view, state } = useCodeMirror({
    value: codeValue,
    container: refEditorDom,
    height: codeEditHeight,
    minHeight: computed(() => codeEditHeight.value === undefined ? '200px' : toValue(props.minHeight)),
    maxHeight: computed(() => codeEditHeight.value === undefined ? '400px' : toValue(props.maxHeight)),

    placeholder: computed(() => toValue(props.placeholder)),
    readOnly: computed(() => toValue(props.readOnly)),
    extensions,
    onChange(value, viewUpdate) {
      undoAndRedoDepth.value = {
        undo: undoDepth(viewUpdate.view.state),
        redo: redoDepth(viewUpdate.view.state),
      }
      codeValue.value = value
      props.onChange?.(value, viewUpdate)
    },
  })

  provide(codeEditStoreKey, {
    state,
    view,
  })

  const codeLanguage = ref(toValue(props.language))
  watch(() => props.language, async (language) => {
    if (!language) {
      codeLanguage.value = 'Plaintext'
      return
    }
    const found = LanguageDescription.matchLanguageName(languages, language, true)
    if (found instanceof LanguageDescription) {
      const name = found.name.toLowerCase()

      codeLanguage.value = found.name
      if (name === 'markdown') {
        languageExt.value = markdown({
          codeLanguages: languages,
        })
      }
      else {
        languageExt.value = await found.load()
      }
    }
    else {
      codeLanguage.value = 'Plaintext'
    }
  }, {
    immediate: true,
  })

  const searchConfig = ref({
    search: '',
    // 严格大小写
    caseSensitive: false,
    regexp: false,
    // 全字节匹配
    wholeWord: false,
  })
  const handleSearch = () => {
    if (!view.value) return
    view.value.dispatch({
      effects: setSearchQuery.of(new SearchQuery(toValue(searchConfig))),
    })
  }

  const handleSearchNext = () => {
    if (!view.value) return
    findNext(view.value)
  }
  const handleSearchPrevious = () => {
    if (!view.value) return
    findPrevious(view.value)
  }

  // 因为要用快捷键，打开方式用codemirror的打开面板转一下
  const handleToggleSearchPanel = () => {
    if (!view.value) return
    if (searchPanelDom.value) {
      closeSearchPanel(view.value)
    }
    else {
      openSearchPanel(view.value)
    }
  }

  return () => {
    return (
      <div
        class={cn(
          'rounded-6px b-1px b-zinc-200 b-solid',
          'overflow-auto',
          'pos-relative',
          props.class,
          className.value,
        )}

      >
        <div class={cn(
          'flex items-center gap-1',
          'p-1',
          'b-b-1px b-b-solid b-b-zinc-300',
        )}
        >

          <Select
            class="w-120px"
            bordered={false}
            value={codeLanguage.value}
            onChange={props.onLanguageChange}

            options={[...options, { label: 'Plaintext', value: 'Plaintext' }]}
            size="small"
          />

          <Button
            disabled={!undoAndRedoDepth.value.undo}
            variant="text"
            size="small"
            onClick={() => { view.value && undo(view.value) }}
          >
            <IconUndo />
          </Button>

          <Button
            disabled={!undoAndRedoDepth.value.redo}
            variant="text"
            size="small"
            onClick={() => { view.value && redo(view.value) }}

          >
            <IconRedo />
          </Button>

          <Button
            variant="text"
            size="small"
            class="text-gray-500"
            onClick={handleToggleSearchPanel}
          >
            <IconSearch />
          </Button>

          {(isSupported.value) && (
            <Button
              variant="text"
              size="small"
              onClick={() => { copy(codeValue.value || '') }}

            >
              {h(copied.value ? IconCheck : IconCopy, { class: 'text-gray-500' })}
            </Button>
          )}
          <Button
            variant="text"
            size="small"
            onClick={() => { toggle() }}

          >
            <IconExpand class="text-gray-500" />
          </Button>
        </div>
        <div ref={codeTopContainer} />
        <div ref={refEditorDom} class="cursor-text"></div>

        {searchPanelDom.value && (
          <Teleport to={searchPanelDom.value}>
            <div class={cn(
              'flex justify-between px-2',
            )}
            >
              <div>
                <div class="flex items-center gap-1 bg-zinc-100 px-4 py-1">
                  <Input
                    class="w-180px!"
                    v-model:value={searchConfig.value.search}
                    size="small"
                  />
                  <Button
                    size="small"
                    variant="dashed"
                    color="primary"
                    onClick={handleSearch}
                  >
                    搜索
                  </Button>
                  <Button
                    size="small"
                    variant="text"
                    onClick={handleSearchNext}
                  >
                    <IconArrowDown />
                  </Button>

                  <Button
                    size="small"
                    variant="text"
                    onClick={handleSearchPrevious}
                  >
                    <IconArrowUp />
                  </Button>

                  <Button
                    size="small"
                    variant={searchConfig.value.caseSensitive ? 'link' : 'text'}
                    onClick={() => {
                      searchConfig.value.caseSensitive = !searchConfig.value.caseSensitive
                    }}

                  >
                    <IconCaseUpper />
                  </Button>

                  <Button
                    size="small"
                    variant={searchConfig.value.regexp ? 'link' : 'text'}

                    onClick={() => {
                      searchConfig.value.regexp = !searchConfig.value.regexp
                    }}
                  >
                    <IconRegex />
                  </Button>
                </div>
              </div>

            </div>
          </Teleport>

        )}

        {
          codeBlockList.value.map((codeBlock) => {
            return (
              <Teleport to={codeBlock.dom} key={codeBlock.uid}>
                {codeBlock.vnode}
              </Teleport>
            )
          })
        }
      </div>
    )
  }
}, {
  props: ['value', 'extensions', 'language', 'class', 'placeholder', 'lineNumber', 'lineWrapping', 'height', 'minHeight', 'maxHeight', 'onLanguageChange'],
  inheritAttrs: false,
})

export default CodeEditPro
