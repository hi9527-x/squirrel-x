import type { VNode } from 'vue'
import { h } from 'vue'

import { isEmptyElement } from './isEmptySlot'

export const getNonEmptySlots = (vnode?: VNode[]) => {
  if (!vnode || !Array.isArray(vnode)) return []

  return vnode.filter(ele => !isEmptyElement(ele)).map(ele => h(ele))
}
