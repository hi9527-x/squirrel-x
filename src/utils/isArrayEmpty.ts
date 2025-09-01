export const isArrayEmpty = <T>(val: unknown): val is T[] => {
  if (!Array.isArray(val)) return true
  return !val.length
}

export const safeArray = <T>(val?: T[]) => {
  if (!Array.isArray(val)) return []
  return val
}
