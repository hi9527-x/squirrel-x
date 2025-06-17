import type { ElementContent, Text } from 'hast'
import type { ChildrenRender, CodeProps } from 'squirrel-x'
import { Alert, Code } from 'squirrel-x'
import type { SlotsType, VNode } from 'vue'
import { defineComponent, h } from 'vue'

import { cn, getCodeBlockInfo, getNonEmptySlots, isEmptyElement } from '@/utils'

import type { AlterKey } from '../ui/AlertGh'
import { alterKeys } from '../ui/AlertGh'
import type { VueMdWorkerParams } from './common'
import ghStyles from './styles/github.module.css'
import type { VueMarkdownWorkerSlots } from './VueMarkdownWorker'
import VueMarkdownWorker from './VueMarkdownWorker'

const alterStateReg = new RegExp(`^\\[!(${alterKeys.join('|')})\\]\n?`, 'i')

type VueMarkdownProSlots = VueMarkdownWorkerSlots & {
  codeBlock?: (params: { language: string, code: string }) => VNode[]
}
type VueMarkdownProEmits = {}

type VueMarkdownProProps = {
  class?: string
  codeProps?: Omit<CodeProps, 'code' | 'language'>
} & VueMdWorkerParams

const VueMarkdownPro = defineComponent<VueMarkdownProProps, VueMarkdownProEmits, string, SlotsType<VueMarkdownProSlots>>((props, ctx) => {
  return () => {
    return (
      <div class={cn(ghStyles['markdown-body'], props.class)}>
        <VueMarkdownWorker
          v-slots={{
            components: (params: { tree: ElementContent, childrenRender: ChildrenRender }) => {
              const { tree, childrenRender } = params
              const slotComponents = getNonEmptySlots(ctx.slots.components?.({ tree, childrenRender }))
              if (slotComponents.length) return slotComponents

              if (tree.type !== 'element') return
              const tagName = tree.tagName

              const codeNodeInfo = getCodeBlockInfo(tree)
              if (codeNodeInfo) {
                const slotCodeBlock = getNonEmptySlots(ctx.slots.codeBlock?.({ language: codeNodeInfo.language, code: codeNodeInfo.code }))
                if (slotCodeBlock.length) return slotCodeBlock

                return (
                  <Code
                    {...props.codeProps}
                    language={codeNodeInfo.language}
                    code={codeNodeInfo.code}
                  />
                )
              }

              if (tagName === 'blockquote') {
                const firstNode = tree.children[1]
                if (firstNode.type === 'element' && firstNode.children[0].type === 'text') {
                  const value = firstNode.children[0].value
                  const match = value.match(alterStateReg)
                  const type = (match?.[1] || '').toLowerCase()

                  if (match && type) {
                    const content: Text[] = []
                    const title: Parameters<ChildrenRender>[0] = []
                    for (let i = 0; i < firstNode.children.length; i++) {
                      const element = firstNode.children[i]
                      if (element.type === 'text') {
                        const text = element.value
                        const matchLine = text.match(/\r?\n/)

                        const newlineIndex = matchLine?.index

                        if (matchLine && typeof newlineIndex === 'number') {
                          const newlineLength = matchLine[0].length
                          const beforeNewline = text.substring(0, newlineIndex).replace(match[0], '').trim()
                          const afterNewline = text.substring(newlineIndex + newlineLength)

                          if (beforeNewline) {
                            title.push({
                              type: 'text',
                              value: beforeNewline.replace(match[0], ''),
                            })
                          }
                          if (afterNewline) {
                            content.push({
                              type: 'text',
                              value: afterNewline,
                            })
                          }

                          break
                        }
                      }
                      title.push(element)
                    }
                    const alterContent = [
                      {
                        ...firstNode,
                        children: content,
                      },
                      ...tree.children.slice(2),
                    ]
                    return (
                      <Alert
                        class="mt-4"
                        type={type as AlterKey}
                        v-slots={{
                          message: () => title.length ? <span>{childrenRender(title)}</span> : null,
                          description: () => childrenRender(alterContent),
                        }}
                      />
                    )
                  }
                }
              }
            },
          }}
          content={props.content}
          remarkRehypeOptions={props.remarkRehypeOptions}
        />
      </div>

    )
  }
}, {
  props: ['content', 'remarkRehypeOptions', 'class', 'codeProps'],
  inheritAttrs: false,
})

export default VueMarkdownPro
