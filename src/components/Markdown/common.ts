import remarkParse from 'remark-parse'
import type { Options as RemarkRehypeOptions } from 'remark-rehype'
import remarkRehype from 'remark-rehype'
import type { PluggableList } from 'unified'
import { unified } from 'unified'
import * as v from 'valibot'

export type Options = {
  rehypePlugins: PluggableList
  remarkPlugins: PluggableList
  remarkRehypeOptions: RemarkRehypeOptions
}

const emptyRemarkRehypeOptions = { allowDangerousHtml: true }

export function createProcessor(options?: Partial<Options>) {
  const rehypePlugins = options?.rehypePlugins || []
  const remarkPlugins = options?.remarkPlugins || []
  const remarkRehypeOptions = { ...options?.remarkRehypeOptions ?? {}, ...emptyRemarkRehypeOptions }

  const processor = unified()
    .use(remarkParse)
    .use(remarkPlugins)
    .use(remarkRehype, remarkRehypeOptions)
    .use(rehypePlugins)

  return processor
}

export const WorkerMarkdownSchema = v.object({
  content: v.optional(v.string((issue) => {
    return `Content parameter must be a string. Received: Type: ${typeof issue.input}`
  }), ''),
  remarkRehypeOptions: v.optional(v.object({
    allowDangerousHtml: v.optional(v.boolean('allowDangerousHtml parameter must be a boolean.'), true),
    clobberPrefix: v.optional(v.string('clobberPrefix parameter must be a string.')),
  }), {}),
})

export type VueMdWorkerParams = v.InferInput<typeof WorkerMarkdownSchema>
