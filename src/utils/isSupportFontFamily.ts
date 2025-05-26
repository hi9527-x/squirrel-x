const isSupportFontFamily = (font: string) => {
  if (typeof font !== 'string' || font.trim().length === 0) return false
  if (typeof document === 'undefined' || typeof document.createElement !== 'function') {
    return false;
  }
  const base = 'Arial'
  if (font.toLowerCase() === base.toLowerCase()) {
    return true
  }
  const canvas = document.createElement('canvas')

  const ctx = canvas.getContext('2d', { willReadFrequently: true })!
  const width = 100
  const height = 100

  canvas.width = width
  canvas.height = height
  ctx.textAlign = 'center'
  ctx.fillStyle = 'black'
  ctx.textBaseline = 'middle'

  const gen = (fontName: string) => {
    ctx.clearRect(0, 0, width, height)
    ctx.font = `100px  ${fontName}, ${base}`
    ctx.fillText('a', width / 2, height / 2)
    const imgDataU8 = ctx.getImageData(0, 0, width, height).data
    // console.log(ctx.getImageData(0, 0, width, height));

    return [...imgDataU8].filter(i => i !== 0)
  }

  return gen(base).join('') !== gen(font).join('')
}

export default isSupportFontFamily