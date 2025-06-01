import type { HElement } from 'squirrel-x'
import { Markdown } from 'squirrel-x'
import * as v from 'valibot'
import type { SlotsType, VNode } from 'vue'
import { defineComponent, h } from 'vue'

import { getFileExtension, getFileName } from '@/utils'

import Preview from './Preview'

const CodeDemoSchema = v.object({
  src: v.pipe(v.string(), v.minLength(2)),
  showcode: v.optional(v.string(), ''),
})

type Slots = SlotsType<{
  default?: () => VNode[]
}>
type Emits = {}

type Props = {
  markdown?: string
  modules?: Record<string, any>
  modulesCode?: Record<string, string>
}

const CodePreview = defineComponent<Props, Emits, string, Slots>((props, ctx) => {
  return () => {
    return (
      <Markdown
        allowDangerousHtml
        content={props.markdown}
        v-slots={{
          customRender: (params: { ast: HElement }) => {
            const ast = params.ast
            if (ast.tagName === 'sx-code') {
              const { success, output } = v.safeParse(CodeDemoSchema, ast.properties)
              if (!success) return null
              const component = props.modules?.[output.src]
              if (!component) return null

              const tabsCodeList = output.showcode.split(',').filter(Boolean).map((it) => {
                const extName = getFileExtension(it)
                return {
                  label: getFileName(it),
                  lang: extName,
                  code: props.modulesCode?.[it] || '',
                }
              })

              return (
                <Preview tabsCodeList={tabsCodeList}>
                  {h(component)}
                </Preview>
              )
            }
          },
        }}
      />
    )
  }
}, {
  props: ['markdown', 'modulesCode', 'modules'],
})

export default CodePreview
