import { useClipboard, useFullscreen } from '@vueuse/core'
import hljs from 'highlight.js/lib/core'
import cpp from 'highlight.js/lib/languages/cpp'
import csharp from 'highlight.js/lib/languages/csharp'
import css from 'highlight.js/lib/languages/css'
import go from 'highlight.js/lib/languages/go'
import java from 'highlight.js/lib/languages/java'
import json from 'highlight.js/lib/languages/json'
import markdown from 'highlight.js/lib/languages/markdown'
import php from 'highlight.js/lib/languages/php'
import plaintext from 'highlight.js/lib/languages/plaintext'
import sql from 'highlight.js/lib/languages/sql'
import typescript from 'highlight.js/lib/languages/typescript'
import xml from 'highlight.js/lib/languages/xml'
import yaml from 'highlight.js/lib/languages/yaml'
import pDebounce from 'p-debounce'
import { Button, Select } from 'squirrel-x'
import type { SlotsType, VNode } from 'vue'
import { defineComponent, onMounted, ref, watch } from 'vue'

import { cn } from '@/utils'
import delay from '@/utils/delay'
import isSupportFontFamily from '@/utils/isSupportFontFamily'
import replaceClassNames from '@/utils/replaceClassNames'
import IconCheck from '~icons/lucide/check'
import IconCopy from '~icons/lucide/copy'
import IconExpand from '~icons/lucide/expand'
import IconToggleLeft from '~icons/lucide/toggle-left'
import IconToggleRight from '~icons/lucide/toggle-right'

import jbFont from './font/JetBrainsMono-Medium.woff2?url'
import hljsStyles from './hljs.module.css'

export const languages = [
  'plaintext',
  'json',
  'yaml',
  'java',
  'javascript',
  'typescript',
  'sql',
  'markdown',
  'html',
  'vue',
  'go',
  'cpp',
  'php',
  'csharp',
] as const

type Language = typeof languages[number]

const languageMap: Record<string, Language> = {
  md: 'markdown',
  js: 'javascript',
  ts: 'typescript',
}

hljs.registerLanguage('vue', (hljs) => {
  return {
    subLanguage: 'xml',
    contains: [
      hljs.COMMENT('<!--', '-->', {
        relevance: 10,
      }),
      {
        begin: /^(\s*)(<script>)/gm,
        end: /^(\s*)(<\/script>)/gm,
        subLanguage: 'javascript',
        excludeBegin: true,
        excludeEnd: true,
      },
      {
        begin: /^(\s*)(<script lang=["']ts["']>)/gm,
        end: /^(\s*)(<\/script>)/gm,
        subLanguage: 'typescript',
        excludeBegin: true,
        excludeEnd: true,
      },
      {
        begin: /^(\s*)(<style(\sscoped)?>)/gm,
        end: /^(\s*)(<\/style>)/gm,
        subLanguage: 'css',
        excludeBegin: true,
        excludeEnd: true,
      },
      {
        begin: /^(\s*)(<style lang=["'](scss|sass)["'](\sscoped)?>)/gm,
        end: /^(\s*)(<\/style>)/gm,
        subLanguage: 'scss',
        excludeBegin: true,
        excludeEnd: true,
      },
      {
        begin: /^(\s*)(<style lang=["']stylus["'](\sscoped)?>)/gm,
        end: /^(\s*)(<\/style>)/gm,
        subLanguage: 'stylus',
        excludeBegin: true,
        excludeEnd: true,
      },
    ],
  }
})
hljs.registerLanguage('javascript', typescript)
hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('css', css)
hljs.registerLanguage('html', xml)
hljs.registerLanguage('xml', xml)
hljs.registerLanguage('json', json)
hljs.registerLanguage('java', java)
hljs.registerLanguage('sql', sql)
hljs.registerLanguage('yaml', yaml)
hljs.registerLanguage('markdown', markdown)
hljs.registerLanguage('plaintext', plaintext)
hljs.registerLanguage('php', php)
hljs.registerLanguage('go', go)
hljs.registerLanguage('cpp', cpp)
hljs.registerLanguage('csharp', csharp)

let isHasFont = false
const loadFont = pDebounce(async () => {
  try {
    // await delay(5000)
    if (isHasFont) return true
    const family = 'Jetbrains Mono'
    const fontCdn = jbFont
    isHasFont = isSupportFontFamily(family)

    if (isHasFont) return true
    await delay(2000)
    const fontFace = new FontFace(family, `url(${fontCdn})`)
    await fontFace.load()
    document.fonts.add(fontFace)
    return true
  }
  catch (error) {
    return false
  }
}, 200)

type CodeSlots = SlotsType<{
  default?: () => VNode[]
}>
type CodeEmits = {}

const DEFAULT_TOOLBAR_CONFIG = {
  copy: true,
  fullScreen: true,
  language: 'plaintext',
  lineNum: true,
}

type ToolbarConfig = Partial<typeof DEFAULT_TOOLBAR_CONFIG>

export type CodeProps = {
  code?: string
  language?: string
  showLineNum?: boolean
  toolbar?: boolean | ToolbarConfig
  betterFont?: boolean
  class?: string
}

const NEW_LINE_EXP = /\n(?!$)/g

const genCodeHtml = (code?: string, language?: string) => {
  if (!code) return ''
  const lang = language || 'plaintext'

  const content = hljs.highlight(code, { language: lang }).value
  // return content
  return replaceClassNames(content, hljsStyles)
}

const CodeRender = defineComponent<CodeProps, CodeEmits, string, CodeSlots>((props) => {
  const showLineNum = ref(props.showLineNum !== false)
  const language = ref('plaintext')

  const { copy, copied, isSupported } = useClipboard({
    copiedDuring: 1000,
  })

  const fontLoad = ref(false)
  const elCode = ref<HTMLElement>()

  const { isFullscreen, toggle } = useFullscreen(elCode)

  onMounted(async () => {
    if (props.betterFont !== false) {
      fontLoad.value = await loadFont()
    }
  })

  watch(() => props.language, (lang, oldLang) => {
    if (lang && lang !== oldLang) {
      const langNext = languageMap[lang] ?? lang
      language.value = languages.includes(langNext as Language) ? langNext : 'plaintext'
    }
  }, {
    immediate: true,
  })

  return () => {
    const codeHtml = genCodeHtml(props.code || '', language.value).split(NEW_LINE_EXP)
    const betterFont = props.betterFont !== false
    const codePre = (
      <pre
        class={cn(
          (betterFont) ? 'font-[Jetbrains_Mono]! text-3.5! tracking-wide' : '',
          'font-sans',
          'p0 bg-transparent!',
        )}
      >
        {codeHtml.map((line, idx) => {
          return (
            <div key={idx} class="flex gap-2">
              <div class={[
                'select-none c-gray min-w-5',
                showLineNum.value ? 'block' : 'hidden',
              ]}
              >
                {idx + 1}
              </div>
              <div v-html={line} />
            </div>
          )
        })}
      </pre>
    )

    const toolbarEnable = props.toolbar !== false
    let toolbarConfig: ToolbarConfig = {}

    if (toolbarEnable) {
      toolbarConfig = {
        ...DEFAULT_TOOLBAR_CONFIG,
        ...typeof props.toolbar === 'boolean' ? {} : props.toolbar,
      }
    }

    return (
      <div>
        <div
          class={cn(
            'py-1 px-4 bg-[--bgColor-muted] rounded-md',
            'inline-block',
            isFullscreen.value ? 'bg-white' : '',
            props.class,
          )}
          ref={elCode}
        >
          {toolbarEnable && (
            <div
              class={[
                'flex justify-between',
              ]}
            >
              <div>

                {toolbarConfig.language && (
                  <Select
                    class=""
                    bordered={false}
                    options={languages.map((it) => {
                      return { label: it, value: it }
                    })}
                    size="small"
                    value={language.value}
                    onChange={(val) => {
                      if (typeof val === 'string') {
                        language.value = val
                      }
                    }}
                  />
                )}
              </div>

              <div>
                {toolbarConfig.lineNum && (
                  <Button
                    variant="text"
                    size="small"
                    onClick={() => { showLineNum.value = !showLineNum.value }}
                  >
                    {showLineNum.value
                      ? (
                          <IconToggleLeft
                            class={cn(
                              'c-[--fgColor-muted]',
                            )}
                          />
                        )
                      : (
                          <IconToggleRight
                            class={cn(
                              'c-[--fgColor-muted]',
                            )}
                          />
                        )}
                  </Button>
                )}

                {toolbarConfig.fullScreen && (
                  <Button
                    variant="text"
                    size="small"
                    onClick={() => { toggle() }}
                  >
                    <IconExpand class="c-[--fgColor-muted]" />
                  </Button>
                )}

                {(toolbarConfig.copy && isSupported.value) && (
                  <Button
                    variant="text"
                    size="small"
                    onClick={() => { copy(props.code || '') }}
                  >
                    {copied.value
                      ? (
                          <IconCheck
                            class={cn(
                              'c-[--fgColor-muted]',
                            )}
                          />
                        )
                      : (
                          <IconCopy
                            class={cn(
                              'c-[--fgColor-muted]',
                            )}
                          />
                        )}
                  </Button>
                )}

              </div>
            </div>
          )}
          {codePre}
        </div>
      </div>
    )
  }
}, {
  props: ['code', 'language', 'showLineNum', 'toolbar'],
  inheritAttrs: false,
})

export default CodeRender
