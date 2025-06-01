function getFileName(path: string) {
  return path.replace(/^.*[\\\/]/, '');
}

export default getFileName