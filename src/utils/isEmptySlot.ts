import { isString } from 'es-toolkit'
import type { VNode } from 'vue'
import { Comment, Fragment, Text } from 'vue'

export function isEmptyElement(c: VNode) {
  return (
    c
    && (c.type === Comment
      || (c.type === Fragment && Array.isArray(c.children) && c.children.length === 0)
      || (c.type === Text && isString(c.children) && c.children.trim() === ''))
  )
}

export function isEmptySlot(c?: VNode[]) {
  return !c?.length || c.every(isEmptyElement)
}
