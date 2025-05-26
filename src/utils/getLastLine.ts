const getLastLine = (text: string) => {
  if (!text) return text

  const lastNewLine = text.lastIndexOf('\n')
  return lastNewLine === -1 ? text : text.substring(lastNewLine + 1)
}

export default getLastLine
