import { HighlightStyle, syntaxHighlighting, syntaxTree } from '@codemirror/language'
import type { Range } from '@codemirror/state'
import type { DecorationSet, ViewUpdate } from '@codemirror/view'
import { Decoration, EditorView, panels, ViewPlugin, WidgetType } from '@codemirror/view'
import { tags as t } from '@lezer/highlight'
import { nanoid } from 'nanoid'
import type { VNodeChild } from 'vue'

import { isEmptySlot } from '@/utils'

import type { CodeEditorCodeBlock } from './Types'

export type ThemeSizeParams = { height: string, minHeight: string, maxHeight: string }

export function codeDefaultTheme(params?: Partial<ThemeSizeParams>) {
  const minHeight = params?.minHeight
  const height = params?.height
  const maxHeight = params?.maxHeight
  return EditorView.theme({
    '&': {
      // 这里添加，会影响panel 面板的样式
    },
    '&.cm-focused': {
      outline: 'none',
    },
    '& .cm-scroller': {
      height: height || '100% !important',
      overflow: 'auto',
      ...maxHeight ? { 'max-height': maxHeight } : {},
    },
    '& .cm-gutters': {
      'background-color': 'transparent',
      'border-right-color': 'transparent',
    },
    '.cm-content, .cm-gutter': {
      ...minHeight ? { 'min-height': minHeight } : {},
    },
  })
}

export function githubLightTheme() {
  const style = HighlightStyle.define([
    { tag: [t.standard(t.tagName), t.tagName], color: '#116329' },
    { tag: [t.comment, t.bracket], color: '#6a737d' },
    { tag: [t.className, t.propertyName], color: '#6f42c1' },
    { tag: [t.variableName, t.attributeName, t.number, t.operator], color: '#005cc5' },
    { tag: [t.keyword, t.typeName, t.typeOperator, t.typeName], color: '#d73a49' },
    { tag: [t.string, t.meta, t.regexp], color: '#032f62' },
    { tag: [t.name, t.quote], color: '#22863a' },
    { tag: [t.heading, t.strong], color: '#24292e', fontWeight: 'bold' },
    { tag: [t.emphasis], color: '#24292e', fontStyle: 'italic' },
    { tag: [t.deleted], color: '#b31d28', backgroundColor: 'ffeef0' },
    { tag: [t.atom, t.bool, t.special(t.variableName)], color: '#e36209' },
    { tag: [t.url, t.escape, t.regexp, t.link], color: '#032f62' },
    { tag: t.link, textDecoration: 'underline' },
    { tag: t.strikethrough, textDecoration: 'line-through' },
    { tag: t.invalid, color: '#cb2431' },
  ])

  return syntaxHighlighting(style)
}

export function panelsContainer(...args: Parameters<typeof panels>) {
  return panels(...args)
}

export function panelTopTheme() {
  return EditorView.theme({
    '& .cm-panels-top': {
      'position': 'absolute',
      'right': '0px',
      'top': '0px',
      'background-color': 'transparent',
      'border-bottom': 'none',

    },
  })
}

export function codeBlockCustomRenderExt(config: {
  onChange: (list: CodeEditorCodeBlock, type: 'add' | 'remove') => void
  getVnode: (params: { code: string, language: string }) => VNodeChild | null
}) {
  class CodeBlockButtonWidget extends WidgetType {
    codeContent: string
    language: string
    uid: string
    vnode: VNodeChild
    constructor(codeContent: string, language: string, vnode: VNodeChild) {
      super()
      this.codeContent = codeContent
      this.language = language
      this.vnode = vnode
      this.uid = nanoid()
    }

    eq(other: WidgetType) {
      return other instanceof CodeBlockButtonWidget
        && other.codeContent === this.codeContent
        && other.language === this.language
    }

    toDOM() {
      const dom = document.createElement('dom')
      config.onChange({
        uid: this.uid,
        dom,
        code: this.codeContent,
        language: this.language,
        vnode: this.vnode,
      }, 'add')
      return dom
    }

    updateDOM(dom: HTMLElement) {
      return false
    }

    destroy(dom: HTMLElement) {
      config.onChange({
        uid: this.uid,
        dom,
        code: this.codeContent,
        language: this.language,
        vnode: this.vnode,
      }, 'remove')
    }
  }

  const codeBlockButtonPlugin = ViewPlugin.fromClass(class {
    decorations: DecorationSet
    hoverPos: number | null = null
    constructor(view: EditorView) {
      this.decorations = this.getDecorations(view)
    }

    update(update: ViewUpdate) {
      if (update.docChanged || update.viewportChanged) {
        this.decorations = this.getDecorations(update.view)
      }
    }

    getDecorations(view: EditorView): DecorationSet {
      if (this.hoverPos == null) return Decoration.none

      const decorations: Range<Decoration>[] = []
      for (const { from, to } of view.visibleRanges) {
        syntaxTree(view.state).iterate({
          from,
          to,
          enter: (node) => {
            if (node.name === 'FencedCode' && node.from <= this.hoverPos! && node.to >= this.hoverPos!) {
              const info = node.node?.getChild('CodeInfo')
              const language = info ? view.state.sliceDoc(info.from, info.to).trim() : ''

              const textNode = node.node?.getChild('CodeText')
              const codeContent = textNode ? view.state.sliceDoc(textNode.from, textNode.to).trim() : ''

              const vnode = config.getVnode({ code: codeContent, language })

              if (vnode && !isEmptySlot(vnode)) {
                const buttonPos = view.state.doc.lineAt(node.from).to
                const buttonDecoration: Decoration = Decoration.widget({
                  widget: new CodeBlockButtonWidget(codeContent, language, vnode),
                  side: 1,
                  block: false,
                })
                decorations.push(buttonDecoration.range(buttonPos))
              }
            }
          },
        })
      }
      return Decoration.set(decorations)
    }
  }, {
    decorations: (v: { decorations: DecorationSet }) => v.decorations,
    eventHandlers: {
      mousemove(event, view) {
        const plugin = view.plugin(codeBlockButtonPlugin)
        if (plugin) {
          const pos = view.posAtCoords({ x: event.clientX, y: event.clientY })
          if (plugin.hoverPos !== pos) {
            plugin.hoverPos = pos
            plugin.decorations = plugin.getDecorations(view)
            view.dispatch({ effects: [] })
          }
        }
      },

      mouseleave(event, view) {
        const plugin = view.plugin(codeBlockButtonPlugin)
        if (plugin && plugin.hoverPos !== null) {
          plugin.hoverPos = null
          plugin.decorations = Decoration.none
          view.dispatch({ effects: [] })
        }
      },
    },
  })

  // function buildCodeBlockDecorations(state: EditorState): DecorationSet {
  //   const decorations: Range<Decoration>[] = []
  //   const view = EditorView.findFromDOM(document.body)

  //   if (!view) return Decoration.none

  //   for (const { from, to } of view.visibleRanges) {
  //     syntaxTree(state).iterate({
  //       from,
  //       to,
  //       enter: (node) => {
  //         if (node.name === 'FencedCode') {
  //           const codeBlockStartPos = node.from
  //           const codeBlockEndPos = node.to
  //           const firstLine = state.doc.lineAt(codeBlockStartPos)

  //           let codeContentStart = firstLine.from + firstLine.text.length + 1
  //           if (codeContentStart >= codeBlockEndPos - 3) {
  //             codeContentStart = codeBlockEndPos - 3
  //           }

  //           const codeContent = state.sliceDoc(codeContentStart, codeBlockEndPos - 3).trim()

  //           const vnode = config.getVnode({ code: codeContent, language: '' })
  //           if (isVNode(vnode)) {
  //             const buttonDecoration: Decoration = Decoration.widget({
  //               widget: new CodeBlockButtonWidget(codeContent, '', vnode),
  //               block: true,
  //               side: -1,
  //             })
  //             decorations.push(buttonDecoration.range(codeBlockStartPos))
  //           }
  //         }
  //       },
  //     })
  //   }

  //   return Decoration.set(decorations)
  // }

  // const codeBlockButtonField = StateField.define<DecorationSet>({
  //   create(state: EditorState) {
  //     return buildCodeBlockDecorations(state)
  //   },

  //   update(decorations, tr) {
  //     if (tr.docChanged) {
  //       return buildCodeBlockDecorations(tr.state)
  //     }
  //     return decorations
  //   },

  //   provide: field => EditorView.decorations.from(field),
  // })

  // return [codeBlockButtonField]

  return [codeBlockButtonPlugin]
}
