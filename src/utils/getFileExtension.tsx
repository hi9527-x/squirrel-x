function getFileExtension(filename: string) {
  const lastDot = filename.lastIndexOf('.');
  return lastDot === -1 ? '' : filename.substring(lastDot + 1);
}

export default getFileExtension