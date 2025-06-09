export const delay = (ms = 500) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}
