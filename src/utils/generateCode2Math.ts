import type { KatexOptions } from 'katex'
import { renderToString } from 'katex'

const code2Math: Record<string, string> = {}
const generateCode2Math = (tex: string, katexOptions?: KatexOptions) => {
  if (!tex) return ''
  if (code2Math[tex]) return code2Math[tex]

  let html = ''

  try {
    html = renderToString(tex, {
      throwOnError: false,
      ...katexOptions ?? {},
    })
  }
  catch (error) {
    return ''
  }
  // html = replaceClassNames(html, katexStyles)
  code2Math[tex] = html
  return html
}

export default generateCode2Math
