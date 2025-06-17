import type { ElementContent, Root, RootContent } from 'hast'
import type { SlotsType, VNode } from 'vue'
import { defineComponent, h } from 'vue'

import { isEmptyElement } from '@/utils'

type DisplayNode = RootContent | Root

export type ChildrenRender = (tree: DisplayNode | DisplayNode[]) => VNode

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
  const render: ChildrenRender = (tree) => {
    const currentAst = Array.isArray(tree) ? tree : [tree]

    return (
      <>
        {currentAst.map((tree) => {
          const type = tree.type
          if (type === 'doctype') return null

          if (type === 'root') return render(tree.children)

          if (type === 'element' && props.disallowedElements?.includes(tree.tagName)) return null

          const slotCustomRender = ctx.slots.components?.({ tree, childrenRender: render })
          const customRenderArr = slotCustomRender?.filter(ele => !isEmptyElement(ele))?.map(ele => h(ele)) ?? []
          if (customRenderArr.length) return customRenderArr

          if (type === 'element') {
            return h(tree.tagName, { ...tree.properties, class: tree.properties?.className || '' }, render(tree.children))
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

    return render(props.hast)
  }
}, {
  props: ['hast', 'disallowedElements'],
})

export default MarkdownToVnode
