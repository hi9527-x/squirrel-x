import { watchDebounced } from '@vueuse/core'
import clsx from 'clsx'
import DOMPurify from 'dompurify'
import { drop, isBoolean } from 'es-toolkit'
import type { Element as HElement, Root, RootContent } from 'hast'
import type { FootnoteDefinition as MdFootnoteDefinition, Root as MdRoot, RootContent as MdRootContent } from 'mdast'
import rehypeRaw from 'rehype-raw'
import remarkGemoji from 'remark-gemoji'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import remarkParse from 'remark-parse'
import type { Options as HstOptions } from 'remark-rehype'
import remarkRehype from 'remark-rehype'
import type { CodeProps } from 'squirrel-x'
import { Button, Code, Popover } from 'squirrel-x'
import { unified } from 'unified'
import { visit } from 'unist-util-visit'
import type { SlotsType, VNode } from 'vue'
import { defineComponent, h, ref, shallowRef } from 'vue'
import { Fragment, jsx } from 'vue/jsx-runtime'

import { cn, isArrayEmpty, isEmptyElement } from '@/utils'
import IconCircleAlert from '~icons/lucide/circle-alert'
import IconInfo from '~icons/lucide/info'
import IconLightbulb from '~icons/lucide/lightbulb'
import IconMessageSquareWarning from '~icons/lucide/message-square-warning'
import IconTriangleAlert from '~icons/lucide/triangle-alert'

import KatexRender from './KatexRender'
import ghStyles from './styles/github.module.css'
import styles from './styles/index.module.less'

export const alterKeys = ['note', 'tip', 'warning', 'important', 'caution'] as const
export type AlterKey = typeof alterKeys[number]

declare module 'mdast' {
  export interface BlockquoteAlter extends Parent {
    type: 'blockquote-alter'
    alter: AlterKey
  }

  export interface RootContentMap {
    'blockquote-alter': BlockquoteAlter
  }
}

const alterStateMap: Record<AlterKey, { icon: VNode, class: string }> = {
  note: {
    class: ghStyles['markdown-alert-note'],
    icon: <IconInfo />,

  },
  tip: {
    class: ghStyles['markdown-alert-tip'],
    icon: <IconLightbulb />,
  },
  warning: {
    class: ghStyles['markdown-alert-warning'],
    icon: <IconTriangleAlert />,
  },
  important: {
    class: ghStyles['markdown-alert-important'],
    icon: <IconMessageSquareWarning />,
  },
  caution: {
    class: ghStyles['markdown-alert-caution'],
    icon: <IconCircleAlert />,
  },
}

const alterStateReg = new RegExp(`^\\[!(${alterKeys.join('|')})\\]\n?`, 'i')

type HAstContent = RootContent | RootContent[]
export type MdRenderSlots = SlotsType<{
  customRender?: (params: { ast: HElement, childrenRender: (ast: HAstContent) => VNode }) => VNode[]
  codeBlock?: (params: { language: string, code: string }) => VNode[]
}>

export type MdRenderProps = {
  content?: string
  allowDangerousHtml?: boolean
  class?: string
  codeProps?: Omit<CodeProps, 'code' | 'language'>
}

export type MdRenderEmits = {}

const mdast2hast: HstOptions['handlers'] = {
  'blockquote-alter': (state, node, parent) => {
    return {
      type: 'element',
      tagName: 'sx-alter',
      children: state.all(node),
      properties: {
        alter: node.alter,
      },
    }
  },
}

const MDRender = defineComponent<MdRenderProps, MdRenderEmits, string, MdRenderSlots>((props, ctx) => {
  const hAst = shallowRef<RootContent[]>([])
  const loading = shallowRef(false)
  // const footnoteList = ref<Record<string, FootnoteDefinition['children']>>({})

  const processor = unified()
    .use(remarkParse)
    .use(() => {
      return (tree: MdRoot) => {
        visit(tree, 'blockquote', (node, index, parent) => {
          const children = node.children
          const firstNode = children[0]

          if (firstNode?.type === 'paragraph' && firstNode.children?.[0]?.type === 'text') {
            const firstTextNode = firstNode.children?.[0]
            if (!firstTextNode || !firstTextNode.value) return

            const match = firstTextNode.value.match(alterStateReg)
            if (match?.[1]) {
              firstTextNode.value = firstTextNode.value.replace(match[0], '')
              // @ts-expect-error 允许修改
              node.type = 'blockquote-alter'
              // @ts-expect-error 允许修改
              node.alter = match[1].toLowerCase()
            }
          }
        })
      }
    })
    .use(remarkGemoji)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkRehype, {
      allowDangerousHtml: !!props.allowDangerousHtml,
      handlers: mdast2hast,
    })
    .use(rehypeRaw)

  const parseMdText2Ast = async () => {
    try {
      if (!props.content) return

      loading.value = true

      const ast = await processor.run(processor.parse(props.content || '')) as Root
      console.log('>>', ast)

      // footnoteList.value = {}
      // visit(ast, 'footnoteDefinition', (node) => {
      //   if (!Array.isArray(footnoteList.value[node.identifier])) {
      //     footnoteList.value[node.identifier] = []
      //   }
      //   footnoteList.value[node.identifier].push(...node.children)
      // })

      hAst.value = ast.children
    }
    catch (error) {
      console.error(error)
    }
    finally {
      loading.value = false
    }
  }

  watchDebounced(() => props.content, (content, oldContent) => {
    if (content && oldContent !== content) {
      parseMdText2Ast()
    }
  }, {
    immediate: true,
    debounce: 50,
    maxWait: 100,
  })

  const render = (ast: HAstContent): VNode => {
    const currentAst = Array.isArray(ast) ? ast : [ast]

    return (
      <>
        {currentAst.map((astIt) => {
          if (astIt.type === 'element') {
            const slotCustomRender = ctx.slots.customRender?.({ ast: astIt, childrenRender: render })

            const customRenderArr = slotCustomRender?.filter(ele => !isEmptyElement(ele))?.map((ele: any) => h(ele)) ?? []

            if (customRenderArr.length) return customRenderArr
            const tagName = astIt.tagName
            if (tagName === 'pre') {
              const first = astIt.children[0].type === 'element' ? astIt.children[0] : null
              if (first) {
                const classNames = first.properties.className

                if (Array.isArray(classNames) && classNames.length) {
                  let lang = ''
                  let code = ''
                  for (let i = 0; i < classNames.length; i++) {
                    const cls = classNames[i].toString()
                    const langMatch = cls.match(/^language-([\w-]+)$/)?.[1] ?? ''
                    if (langMatch) {
                      lang = langMatch
                      break
                    }
                  }

                  if (lang) {
                    code = first.children[0].type === 'text' ? first.children[0].value : ''
                    const codeSlots = ctx.slots.codeBlock?.({ language: lang, code })
                    const codeSlotsArr = codeSlots?.filter(ele => !isEmptyElement(ele))?.map((ele: any) => h(ele)) ?? []
                    if (codeSlotsArr.length) return codeSlotsArr
                    return (
                      <Code
                        code={code}
                        language={lang}
                        {...props.codeProps}
                      />
                    )
                  }
                }
              }
            }

            if (tagName === 'sx-alter') {
              const alterName = astIt.properties.alter
              if (typeof alterName !== 'string' || !alterName) return null

              const alterState = alterStateMap[alterName as AlterKey]
              if (!alterState) return null

              return (
                <div class={[ghStyles['markdown-alert'], alterState.class]}>
                  <p class={ghStyles['markdown-alert-title']}>
                    {h(alterState.icon, {
                      class: ['mr-2'],
                    })}
                    {alterName.toUpperCase()}
                  </p>
                  {render(astIt.children)}
                </div>
              )
            }

            const oldClassName = astIt.properties.className

            const className = Array.isArray(oldClassName)
              ? oldClassName.map((cls) => {
                  return ghStyles[cls]
                })
              : []

            return h(astIt.tagName, { ...astIt.properties, class: className }, render(astIt.children))
          }

          if (astIt.type === 'text') {
            return astIt.value
          }

          return null
        })}
      </>
    )
  }

  return () => {
    return (
      <div
        class={cn(
          ghStyles['markdown-body'],
          'overflow-y-hidden',
          styles.markdown,
          props.class,
        )}
      >
        {render(hAst.value)}
      </div>
    )
  }
}, {
  props: ['content', 'allowDangerousHtml', 'class', 'codeProps'],
})

export default MDRender
