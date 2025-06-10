import type { Element, Root, RootContent } from 'hast'
import type { SlotsType, VNode } from 'vue'
import { defineComponent, h } from 'vue'

import { isEmptyElement } from '@/utils'

type HAstContent = RootContent | RootContent[]

export type Md2VnodeSlots = {
  components?: (params: { ast: Element, childrenRender: (ast: HAstContent) => VNode }) => VNode[]
}
type Md2VnodeEmits = {}

export type Md2VnodeProps = {
  hast?: Root
  disallowedElements?: string[]
}

const Md2Vnode = defineComponent<Md2VnodeProps, Md2VnodeEmits, string, SlotsType<Md2VnodeSlots>>((props, ctx) => {
  const render = (ast: HAstContent): VNode => {
    const currentAst = Array.isArray(ast) ? ast : [ast]

    return (
      <>
        {currentAst.map((ast) => {
          if (ast.type === 'element') {
            if (props.disallowedElements?.includes(ast.tagName)) return null
            const slotCustomRender = ctx.slots.components?.({ ast, childrenRender: render })

            const customRenderArr = slotCustomRender?.filter(ele => !isEmptyElement(ele))?.map(ele => h(ele)) ?? []

            if (customRenderArr.length) return customRenderArr
            return h(ast.tagName, { ...ast.properties }, render(ast.children))
          }

          if (ast.type === 'text') {
            return ast.value
          }

          return null
        })}
      </>
    )
  }

  return () => {
    return (
      <div>
        {render(props.hast?.children ?? [])}
      </div>
    )
  }
}, {
  props: ['hast', 'disallowedElements'],
})

export default Md2Vnode
