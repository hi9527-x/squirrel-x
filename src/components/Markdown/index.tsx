import { watchDebounced } from '@vueuse/core'
import { pick } from 'es-toolkit'
import type { FootnoteDefinition as MdFootnoteDefinition, Root as MdRoot, RootContent as MdRootContent } from 'mdast'
import rehypeRaw from 'rehype-raw'
import remarkGemoji from 'remark-gemoji'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import remarkParse from 'remark-parse'
import type { Options as RemarkRehypeOptions } from 'remark-rehype'
import remarkRehype from 'remark-rehype'
import type { CodeProps, HElement, HRoot, HRootContent } from 'squirrel-x'
import { Code } from 'squirrel-x'
import type { PluggableList } from 'unified'
import { unified } from 'unified'
import { visit } from 'unist-util-visit'
import type { SlotsType, VNode } from 'vue'
import { defineComponent, h, ref, shallowRef, watch } from 'vue'

import { cn, isEmptyElement } from '@/utils'
import IconCircleAlert from '~icons/lucide/circle-alert'
import IconInfo from '~icons/lucide/info'
import IconLightbulb from '~icons/lucide/lightbulb'
import IconMessageSquareWarning from '~icons/lucide/message-square-warning'
import IconTriangleAlert from '~icons/lucide/triangle-alert'

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
type CodeDisplay = 'block' | 'inline'

type HAstContent = HRootContent | HRootContent[]
export type MdRenderSlots = SlotsType<{
  customRender?: (params: { ast: HElement, childrenRender: (ast: HAstContent) => VNode }) => VNode[]
  codeBlock?: (params: { language: string, code: string, display: CodeDisplay }) => VNode[]
}>

export type MdRenderProps = {
  content?: string
  allowDangerousHtml?: boolean
  class?: string
  codeProps?: Omit<CodeProps, 'code' | 'language'>
}

export type MdRenderEmits = {}

const mdast2hast: RemarkRehypeOptions['handlers'] = {
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

type Options = {
  rehypePlugins?: PluggableList
  remarkPlugins?: PluggableList
  remarkRehypeOptions?: RemarkRehypeOptions
}
function createProcessor(options?: Options) {
  const rehypePlugins = options?.rehypePlugins || []
  const remarkPlugins = options?.remarkPlugins || []
  const remarkRehypeOptions = options?.remarkRehypeOptions
    ? { ...options.remarkRehypeOptions }
    : {}

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
    .use(remarkPlugins)
    .use(remarkRehype, {
      ...remarkRehypeOptions,
      handlers: {
        ...remarkRehypeOptions.handlers ?? {},
        ...mdast2hast,
      },
    })
    .use(rehypeRaw)
    .use(rehypePlugins)

  return processor
}

const MDRender = defineComponent<MdRenderProps, MdRenderEmits, string, MdRenderSlots>((props, ctx) => {
  const hAst = shallowRef<HRootContent[]>([])
  const loading = shallowRef(false)

  // 后续会放web worker 暂未找到合适的入参方式，不支持自定义插件
  // 某些插件需要浏览器运行时，
  const processor = createProcessor({
    remarkRehypeOptions: {
      allowDangerousHtml: !!props.allowDangerousHtml,
    },
  })

  const parseMdText2Ast = async () => {
    try {
      if (!props.content) return

      loading.value = true

      const ast = await processor.run(processor.parse(props.content || '')) as HRoot
      // console.log('>>', ast.children)

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
    maxWait: 60,
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

            let codeNode: HElement | null = null
            let display: CodeDisplay = 'block'
            if (tagName === 'pre') {
              codeNode = astIt.children[0].type === 'element' ? astIt.children[0] : null
            }
            if (tagName === 'code') {
              display = 'inline'
              codeNode = astIt
            }

            if (codeNode) {
              const classNames = codeNode.properties.className

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
                  code = codeNode.children[0].type === 'text' ? codeNode.children[0].value : ''
                  const codeSlots = ctx.slots.codeBlock?.({ language: lang, code, display })
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
