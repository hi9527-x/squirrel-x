import { isString } from 'es-toolkit'
import type { VNode, VNodeChild } from 'vue'
import { Comment, Fragment, isVNode, Text } from 'vue'

/**
 * 判断单个 VNode 是否为空元素
 */
export function isEmptyElement(c?: VNode): boolean {
  if (!c || !isVNode(c)) return true

  // 注释节点
  if (c.type === Comment) return true

  // 空 Fragment
  if (c.type === Fragment && Array.isArray(c.children) && c.children.length === 0) return true

  // 空文本节点
  if (c.type === Text) {
    if (isString(c.children) && c.children.trim() === '') return true
  }

  return false
}

/**
 * 判断 slot 内容是否为空
 */
export function isEmptySlot(c?: VNodeChild | VNodeChild[]): boolean {
  if (!c) return true

  const list = normalizeVNodes(c)
  return list.length === 0 || list.every(isEmptyElement)
}

/**
 * 统一规范化 VNode 或 VNode 数组
 */
export function normalizeVNodes(c?: VNodeChild | VNodeChild[]): VNode[] {
  if (!c) return []
  return (Array.isArray(c) ? c : [c]).filter(isVNode)
}
