export const isArrayEmpty = (val: unknown) => {
  if (!Array.isArray(val)) return true
  return !val.length
}

export const safeArray = <T>(val?: T[]) => {
  if (!Array.isArray(val)) return []
  return val
}
