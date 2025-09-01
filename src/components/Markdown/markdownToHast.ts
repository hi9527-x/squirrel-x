import { raw } from 'hast-util-raw'
import type { Parent as MdAstParent, Root as MdAstRoot, RootContent as MdAstRootContent } from 'mdast'
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

function isParent(node: MdAstRootContent): node is MdAstRootContent & MdAstParent {
  return 'children' in node && Array.isArray(node.children)
}

function extractImageNode(tree: MdAstRoot) {
  const images: { url: string, alt: string }[] = []
  const traverse = (node: MdAstRootContent[]) => {
    node.forEach((item) => {
      if (item.type === 'image') {
        images.push({
          url: item.url,
          alt: item.alt || '',
        })
      }

      if (isParent(item)) {
        traverse(item.children)
      }
    })
  }
  traverse(tree.children)
  return images
}

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

    const images = extractImageNode(mdast)

    globalThis.postMessage({
      hast,
      mdast,
      images,
      uid,
    })
  }
  catch (error) {
    console.error(error)
    globalThis.postMessage({ error })
  }
})
