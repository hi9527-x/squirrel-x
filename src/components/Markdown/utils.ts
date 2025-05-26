import type { KatexOptions } from 'katex'
import { renderToString } from 'katex'

const code2Math: Record<string, string> = {}
export const generateCode2Math = (code: string, katexOptions?: KatexOptions) => {
  if (!code) return ''
  if (code2Math[code]) return code2Math[code]

  let html = ''

  try {
    html = renderToString(code, {
      throwOnError: false,
      ...katexOptions ?? {},
    })
  }
  catch (error) {
    return ''
  }
  // html = replaceClassNames(html, katexStyles)
  code2Math[code] = html
  return html
}
