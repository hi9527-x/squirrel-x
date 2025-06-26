export function capitalizeFirstLetterTL(str: string) {
  if (typeof str !== 'string' || str.length === 0) {
    return ''
  }
  return `${str.charAt(0).toUpperCase()}${str.slice(1)}`
}

export function capitalizeFirstLetterAndLowercaseRest(str: string) {
  if (typeof str !== 'string' || str.length === 0) {
    return ''
  }
  const firstChar = str.charAt(0).toUpperCase()
  const restOfString = str.slice(1).toLowerCase()
  return firstChar + restOfString
}
