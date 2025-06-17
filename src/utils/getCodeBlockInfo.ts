import type { HElementContent } from 'squirrel-x'

export const getCodeBlockInfo = (ele: HElementContent) => {
  if (ele.type !== 'element' || ele.tagName !== 'pre') return false
  const codeNode = ele.children[0]?.type === 'element' ? ele.children[0] : null

  if (!codeNode) return false
  const classNames = codeNode.properties.className

  if (Array.isArray(classNames) && classNames.length) {
    let language = ''
    let code = ''
    for (let i = 0; i < classNames.length; i++) {
      const cls = classNames[i].toString()
      const langMatch = cls.match(/^language-([\w-]+)$/)?.[1] ?? ''
      if (langMatch) {
        language = langMatch
        break
      }
    }

    if (language) {
      code = codeNode.children[0].type === 'text' ? codeNode.children[0].value : ''

      return {
        language,
        code,
      }
    }
  }
  return false
}
