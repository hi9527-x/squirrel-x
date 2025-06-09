import { raw } from 'hast-util-raw'
import { fromMarkdown } from 'mdast-util-from-markdown'
import { toHast } from 'mdast-util-to-hast'
import * as v from 'valibot'

const MarkdownSchema = v.object({
  markdown: v.optional(v.string('markdown 参数错误'), ''),
  allowDangerousHtml: v.optional(v.boolean(), false),
})

globalThis.addEventListener('message', (event) => {
  const output = v.parse(MarkdownSchema, event.data)

  const { markdown, allowDangerousHtml } = output

  const mdast = fromMarkdown(markdown)
  let hast = toHast(mdast, {
    allowDangerousHtml,
  })

  hast = raw(hast)

  console.log('>>', hast)
})
