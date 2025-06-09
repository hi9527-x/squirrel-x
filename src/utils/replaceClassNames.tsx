export const replaceClassNames = (html: string, styles: Record<string, string>) => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')

  doc.querySelectorAll('[class]').forEach((ele) => {
    ele.classList.forEach((cls) => {
      if (styles[cls]) {
        ele.classList.replace(cls, styles[cls])
      }
    })
  })

  return doc.body.innerHTML
}
