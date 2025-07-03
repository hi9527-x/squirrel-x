import { nameToEmoji } from 'gemoji'
import type { ElementContent, Text } from 'hast'
import type { ChildrenRender, CodeProps } from 'squirrel-x'
import { Alert, Code } from 'squirrel-x'
import type { SlotsType, VNode } from 'vue'
import { defineComponent, h } from 'vue'

import { capitalizeFirstLetterAndLowercaseRest, cn, getCodeBlockInfo, getNonEmptySlots } from '@/utils'

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
} & Omit<VueMdWorkerParams, 'uid'>

const shortcodeRegex = /:([\w+\-]+):/g

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

              if (tree.type === 'text') {
                return tree.value.replace(shortcodeRegex, (match, shortcodeName) => {
                  const unicodeEmoji = nameToEmoji[shortcodeName]

                  if (unicodeEmoji) {
                    return unicodeEmoji
                  }
                  else {
                    return match
                  }
                })
              }

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
                if (firstNode?.type === 'element' && firstNode.children[0]?.type === 'text') {
                  const value = firstNode.children[0].value
                  const match = value.match(alterStateReg)
                  const type = (match?.[1] || '').toLowerCase()

                  if (match && type) {
                    const content: Text[] = []
                    const title: Parameters<ChildrenRender>[0] = []
                    let lineIndex = 0
                    for (; lineIndex < firstNode.children.length; lineIndex++) {
                      const element = firstNode.children[lineIndex]
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
                              value: beforeNewline,
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

                    if (title[0]?.type === 'text') {
                      let text = title[0].value
                      const regexp = new RegExp(`^(\\[!${match[1]}\\])`, 'i')
                      text = title[0].value.replace(regexp, '')
                      if (!text.trim()) {
                        text = capitalizeFirstLetterAndLowercaseRest(match[1])
                      }
                      title[0].value = text
                    }

                    const alterContent = [
                      {
                        ...firstNode,
                        children: [
                          ...content,
                          ...firstNode.children.slice(lineIndex + 1),
                        ],
                      },
                      ...tree.children.slice(2),
                    ].filter((it) => {
                      if (it.type === 'element' && !it.children.length) {
                        return false
                      }
                      else if (it.type === 'text') {
                        const value = it.value.replace('/\r?\n/', '').trim()
                        if (!value) return false
                      }

                      return true
                    })
                    // console.log('>> tree', tree)
                    // console.log('>> title', title)
                    // console.log('>> alterContent', alterContent)

                    return (
                      <Alert
                        class="my-2"
                        type={type as AlterKey}
                        v-slots={{
                          message: () => title.length ? <span>{childrenRender(title)}</span> : null,
                          description: () => alterContent.length ? childrenRender(alterContent) : null,
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
