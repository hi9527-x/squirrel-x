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

import { WorkerMarkdownSchema } from './common'

globalThis.addEventListener('message', (event) => {
  try {
    const output = v.parse(WorkerMarkdownSchema, event.data)

    const { content, remarkRehypeOptions, uid } = output

    const mdast = fromMarkdown(content, {
      extensions: [math(), gfm(), frontmatter(['yaml', 'toml'])],
      mdastExtensions: [mathFromMarkdown(), gfmFromMarkdown(), frontmatterFromMarkdown(['yaml', 'toml'])],
    })
    let hast = toHast(mdast, remarkRehypeOptions)

    hast = raw(hast)

    globalThis.postMessage({
      hast,
      mdast,
      uid,
    })
  }
  catch (error) {
    console.error(error)
    globalThis.postMessage({ error })
  }
})
