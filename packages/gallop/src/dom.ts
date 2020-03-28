export function cleanDofStr(str: string) {
  return str
    .replace(/(^\s)|(\s$)/, '')
    .replace(/>\s*/g, '>')
    .replace(/\s*</g, '<')
    .replace(/>(\s*?)</g, '><')
    .trim()
}
