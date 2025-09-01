import type { ElementContent, Root, RootContent } from 'hast'
import type { SlotsType, VNode } from 'vue'
import { defineComponent, h } from 'vue'

import { getNonEmptySlots, isArrayEmpty } from '@/utils'

export type DisplayNode = RootContent | Root

export type ChildrenRender = () => VNode

type MarkdownNodeRenderParams = { tree: ElementContent, childrenRender: ChildrenRender }

export type MarkdownToVnodeSlots = {
  components?: (params: MarkdownNodeRenderParams) => VNode[]
}
type MarkdownToVnodeEmits = {}

export type MarkdownToVnodeProps = {
  hast?: Root
  disallowedElements?: string[]
}

const MarkdownToVnode = defineComponent<MarkdownToVnodeProps, MarkdownToVnodeEmits, string, SlotsType<MarkdownToVnodeSlots>>((props, ctx) => {
  const render = (tree: DisplayNode | DisplayNode[], child: boolean): VNode => {
    const currentAst = Array.isArray(tree) ? tree : [tree]

    return (
      <>
        {currentAst.map((tree) => {
          const type = tree.type
          if (type === 'doctype') return null

          if (type === 'root') return render(tree.children, true)

          if (type === 'element') {
            if (props.disallowedElements?.includes(tree.tagName)) return null
            if (child) {
              const slotCustomRender = ctx.slots.components?.({ tree, childrenRender: () => {
                if (!isArrayEmpty(tree.children)) {
                  return render(tree.children, true)
                }
                return render(tree, false)
              } })

              const customRenderArr = getNonEmptySlots(slotCustomRender)
              if (customRenderArr.length) return customRenderArr
            }

            return h(tree.tagName, { ...tree.properties, class: tree.properties?.className || '' }, render(tree.children, true))
          }

          if (type === 'text') {
            return tree.value
          }

          return null
        })}
      </>
    )
  }

  return () => {
    if (!props.hast) return

    return render(props.hast, true)
  }
}, {
  props: ['hast', 'disallowedElements'],
})

export default MarkdownToVnode
