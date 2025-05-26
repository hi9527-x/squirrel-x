export const isArrayEmpty = (val: unknown) => {
  if (!Array.isArray(val)) return true
  return !val.length
}
