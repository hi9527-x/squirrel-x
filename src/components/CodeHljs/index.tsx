import { useClipboard } from '@vueuse/core'
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

import { useViewFullscreen } from '@/components/hook'
import { cn, delay, isSupportFontFamily, replaceClassNames } from '@/utils'
import IconCheck from '~icons/lucide/check'
import IconCopy from '~icons/lucide/copy'
import IconExpand from '~icons/lucide/expand'
import IconToggleLeft from '~icons/lucide/toggle-left'
import IconToggleRight from '~icons/lucide/toggle-right'

import jbFont from './font/JetBrainsMono-Medium.woff2?url'
// import scFont from './font/SourceCodePro-Medium.ttf.woff2?url'
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
    // return false
    if (isHasFont) return true
    const family = 'Jetbrains Mono'
    // const family = 'SourceCodePro'
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
}, 5)

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

  const { className, toggle } = useViewFullscreen()

  const { copy, copied, isSupported } = useClipboard({
    copiedDuring: 1000,
  })

  const fontLoad = ref(false)

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
          'font-sans text-3.5! line-height-normal',
          'px-4 py-2! bg-gray-50!',
          (betterFont && fontLoad.value)
            ? cn(
                'font-[Jetbrains_Mono]!',
                // 'font-[SourceCodePro]!',
                'tracking-wide',
              )
            : '',
        )}
      >
        {codeHtml.map((line, idx) => {
          return (
            <div key={idx} class="flex">
              <div class={[
                'select-none c-gray ',
                showLineNum.value ? 'min-w-5 mr-2' : 'overflow-hidden w-0px',
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
      <div
        class={cn(
          'bg-gray-50 rounded-md bg-gray-50',
          props.class,
          className.value,
        )}
      >
        {toolbarEnable && (
          <div
            class={cn(
              'flex justify-between pos-sticky top-0px',
              'px-2 bg-gray-50',
              'rounded-tr-md rounded-tl-md',
            )}
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
                            'text-gray-500',
                          )}
                        />
                      )
                    : (
                        <IconToggleRight
                          class={cn(
                            'text-gray-500',
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
                  <IconExpand class="text-gray-500" />
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
                            'text-gray-500',
                          )}
                        />
                      )
                    : (
                        <IconCopy
                          class={cn(
                            'text-gray-500',
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
    )
  }
}, {
  props: ['code', 'language', 'showLineNum', 'toolbar'],
  inheritAttrs: false,
})

export default CodeRender
