import { watchDebounced } from '@vueuse/core'
import clsx from 'clsx'
import DOMPurify from 'dompurify'
import { drop, isBoolean } from 'es-toolkit'
import type { FootnoteDefinition, Root, RootContent } from 'mdast'
import remarkGemoji from 'remark-gemoji'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import remarkParse from 'remark-parse'
import type { CodeProps } from 'squirrel-x'
import { Button, Code, Popover } from 'squirrel-x'
import { unified } from 'unified'
import { visit } from 'unist-util-visit'
import type { SlotsType, VNode } from 'vue'
import { defineComponent, h, ref, shallowRef } from 'vue'

import { cn, isEmptyElement } from '@/utils'
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

const alterStateReg = new RegExp(`^\\[!(${Object.keys(alterStateMap).join('|')})\\]\n?`, 'i')

type MDAstContent = RootContent | RootContent[]
export type MdRenderSlots = SlotsType<{
  customRender?: (params: { ast: RootContent, childrenRender: (ast: MDAstContent) => VNode }) => VNode[]
}>

export type MdRenderProps = {
  content?: string
  htmlRender?: boolean
  class?: string
  codeProps?: Omit<CodeProps, 'code' | 'language'>
}

export type MdRenderEmits = {}

const processor = unified()
  .use(remarkParse)
  .use(() => {
    return (tree: Root) => {
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

const MDRender = defineComponent<MdRenderProps, MdRenderEmits, string, MdRenderSlots>((props, ctx) => {
  const mdAst = shallowRef<RootContent[]>([])
  const loading = shallowRef(false)
  const footnoteList = ref<Record<string, FootnoteDefinition['children']>>({})

  const parseMdText2Ast = async () => {
    try {
      if (!props.content) return

      loading.value = true

      const ast = await processor.run(processor.parse(props.content || '')) as Root
      footnoteList.value = {}
      visit(ast, 'footnoteDefinition', (node) => {
        if (!Array.isArray(footnoteList.value[node.identifier])) {
          footnoteList.value[node.identifier] = []
        }
        footnoteList.value[node.identifier].push(...node.children)
      })

      mdAst.value = ast.children
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

  const render = (ast: MDAstContent): VNode => {
    const currentAst = Array.isArray(ast) ? ast : [ast]

    const htmlRender = !!props.htmlRender
    return (
      <>
        {currentAst.map((astItem) => {
          const slotCustomRenderRender = ctx.slots.customRender?.({ ast: astItem, childrenRender: render })

          const arr = slotCustomRenderRender?.filter(ele => !isEmptyElement(ele))?.map((ele: any) => h(ele)) ?? []

          if (arr.length) return arr

          if (astItem.type === 'paragraph') {
            return <p>{render(astItem.children)}</p>
          }

          if (astItem.type === 'heading') {
            const depth = astItem.depth ?? 6
            return h(`h${depth}`, {}, render(astItem.children))
          }

          if (astItem.type === 'code') {
            if (!astItem.lang) return null

            return (
              <Code
                code={astItem.value ?? ''}
                language={astItem.lang ?? ''}
                {...props.codeProps}
              />
            )
          }

          if (astItem.type === 'list') {
            if (astItem.ordered) {
              return (
                <ol>
                  {render(astItem.children)}
                </ol>
              )
            }

            const isTaskNode = isBoolean(astItem.children?.[0]?.checked)
            return (
              <ul
                class={clsx(isTaskNode ? ghStyles['contains-task-list'] : '')}
              >
                {render(astItem.children)}
              </ul>
            )
          }

          if (astItem.type === 'listItem') {
            const isTaskNode = isBoolean(astItem.checked)
            const node: RootContent[] = []
            astItem.children.forEach((it) => {
              if (it.type === 'paragraph') {
                node.push(...it.children)
              }
            })
            return (
              <li
                class={clsx(isTaskNode ? ghStyles['task-list-item'] : '')}
              >
                {isTaskNode && (
                  <input
                    type="checkbox"
                    class={ghStyles['task-list-item-checkbox']}
                    checked={!!astItem.checked}
                    disabled
                  />
                )}
                {render(isTaskNode ? node : astItem.children)}
              </li>
            )
          }

          if (astItem.type === 'inlineCode') {
            return <code>{astItem.value}</code>
          }

          if (astItem.type === 'strong') {
            return <strong>{render(astItem.children)}</strong>
          }
          if (astItem.type === 'delete') {
            return (
              <del>{render(astItem.children)}</del>
            )
          }

          if (astItem.type === 'emphasis') {
            return <em>{render(astItem.children)}</em>
          }

          if (astItem.type === 'image') {
            return <img src={astItem.url} />
          }

          if (astItem.type === 'link') {
            return (
              <a
                title={astItem.title || ''}
                href={astItem.url}
              >
                {render(astItem.children)}
              </a>
            )
          }

          if (astItem.type === 'blockquote-alter') {
            const alterState = alterStateMap[astItem.alter]
            if (!alterState) return null
            return (
              <div class={[ghStyles['markdown-alert'], alterState.class]}>
                <p class={ghStyles['markdown-alert-title']}>
                  {h(alterState.icon, {
                    class: ['mr-2'],
                  })}
                  {astItem.alter.toUpperCase()}
                </p>
                {render(astItem.children)}
              </div>
            )
          }

          if (astItem.type === 'blockquote') {
            return (
              <blockquote>
                {render(astItem.children)}
              </blockquote>
            )
          }

          if (astItem.type === 'table') {
            const thead = astItem.children?.[0]?.children?.map((cell) => {
              return <th>{render(cell.children)}</th>
            })

            const tbody = drop(astItem.children, 1).map((row) => {
              return (
                <tr>
                  {render(row.children)}
                </tr>
              )
            })

            return (
              <table>
                <thead>
                  <tr>{thead}</tr>
                </thead>
                <tbody>{tbody}</tbody>
              </table>
            )
          }

          if (astItem.type === 'tableCell') {
            return <td>{render(astItem.children)}</td>
          }

          if (astItem.type === 'thematicBreak') {
            return <hr />
          }
          if (astItem.type === 'inlineMath') {
            return <KatexRender type="inline" content={astItem.value} />
          }
          if (astItem.type === 'math') {
            return <KatexRender type="block" content={astItem.value} />
          }

          if (astItem.type === 'text') {
            return astItem.value || ''
          }

          if (astItem.type === 'html') {
            if (!htmlRender) return null
            // const matchName = astItem.value.match(/<([a-z0-9]+)/i)?.[1] || ''
            return <div v-html={DOMPurify.sanitize(astItem.value)} />
          }

          if (astItem.type === 'footnoteReference') {
            return (
              <Popover
                v-slots={{
                  content: () => {
                    const list = footnoteList.value[astItem.identifier]
                    return render(list)
                  },
                }}
              >
                <sup>
                  <Button size="small" color="primary" variant="link">
                    [
                    {astItem.label}
                    ]
                  </Button>
                </sup>
              </Popover>
            )
          }

          // console.warn('>>', astItem)

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
        {render(mdAst.value)}
      </div>
    )
  }
}, {
  props: ['content', 'htmlRender', 'class', 'codeProps'],
})

export default MDRender
