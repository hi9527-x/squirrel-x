import { raw } from 'hast-util-raw'
import { fromMarkdown } from 'mdast-util-from-markdown'
import { frontmatterFromMarkdown } from 'mdast-util-frontmatter'
import { gfmFromMarkdown } from 'mdast-util-gfm'
import { mathFromMarkdown } from 'mdast-util-math'
import { toHast } from 'mdast-util-to-hast'
import { frontmatter } from 'micromark-extension-frontmatter'
import { gfm } from 'micromark-extension-gfm'
import { math } from 'micromark-extension-math'
import * as v from 'valibot'

const MarkdownSchema = v.object({
  markdown: v.optional(v.string('markdown 参数错误'), ''),
  allowDangerousHtml: v.optional(v.boolean(), false),
})

globalThis.addEventListener('message', (event) => {
  const output = v.parse(MarkdownSchema, event.data)

  const { markdown, allowDangerousHtml } = output

  console.time('md')

  const mdast = fromMarkdown(markdown, {
    extensions: [math(), gfm(), frontmatter(['yaml', 'toml'])],
    mdastExtensions: [mathFromMarkdown(), gfmFromMarkdown(), frontmatterFromMarkdown(['yaml', 'toml'])],
  })
  let hast = toHast(mdast, {
    allowDangerousHtml,
  })

  hast = raw(hast)
  console.timeEnd('md')

  console.log('>>', hast)
})
