import { isText, isDocumentFragment } from './is'

export const createTreeWalker = (node: Node) =>
  document.createTreeWalker(node, 133, null, false)

export type Primitive =
  | null
  | undefined
  | boolean
  | number
  | string
  | Symbol
  | bigint

export const getFragmentContent = (
  val: DocumentFragment | DocumentFragment[]
) => {
  let nest = document.createElement('div') as HTMLDivElement
  if (isDocumentFragment(val)) {
    nest.appendChild(val.cloneNode(true))
  } else {
    val.forEach(v => {
      nest.appendChild(v.cloneNode(true))
    })
  }
  return nest.innerHTML
}

const getTailSpaceLength = (str: string) => {
  let res = str.match(/(\S){1}\s*$/)
  if (!res) {
    return 0
  }
  let len = res![0].length
  return res![1].startsWith('>') ? 0 : len - 1
}

const getHeadSpaceLength = (str: string) => {
  let res = str.match(/^\s*(\S){1}/)
  if (!res) {
    return 0
  }
  let len = res![0].length
  return res![1].endsWith('<') ? 0 : len - 1
}

export const replaceSpaceToZwnj = (str: string) => {
  let tlen = getTailSpaceLength(str)
  let hlen = getHeadSpaceLength(str)
  let tsps = ''
  let hsps = ''
  for (let index = 0; index < tlen; index++) {
    tsps += ' '
  }
  for (let index = 0; index < hlen; index++) {
    hsps += ' '
  }
  return (hsps && '&zwnj;') + hsps + str.trim() + tsps + (tsps && '&zwnj;')
}

export function getPropsFromFunction<T>(func: (t: T) => unknown) {
  let [funcHead] = digStringBlock(func.toString(), '(')
  let [propsStr, defaultStr] = digStringBlock(funcHead, '{', false)
  let [def] = digStringBlock(defaultStr, '{')
  return {
    propsNames: propsStr.split(',').map(p => p.trim()),
    defaultValue: eval(`(${def})`) as T
  }
}

export function digStringBlock(
  rawStr: string,
  head: '(' | '{' | '[' | '<' | '"' | "'" = '(',
  edge: boolean = true
): [string, string] {
  let tail
  switch (head) {
    case '(':
      tail = ')'
      break
    case '{':
      tail = '}'
      break
    case '[':
      tail = ']'
      break
    case '<':
      tail = '>'
      break
    case '"':
      tail = '"'
      break
    case "'":
      tail = "'"
      break
  }
  let startIndex = rawStr.indexOf(head)
  if (startIndex < 0) {
    return ['', rawStr]
  }
  let endIndex
  let arr = [...rawStr]
  let stack = [0]
  for (let i = startIndex + 1; i < arr.length; i++) {
    if (arr[i] === head) {
      stack.push(0)
    } else if (arr[i] === tail) {
      stack.pop()
    }

    if (stack.length === 0) {
      endIndex = i
      return [
        rawStr
          .slice(
            edge ? startIndex : startIndex + 1,
            edge ? endIndex + 1 : endIndex
          )
          .trim(),
        rawStr.slice(endIndex + 1)
      ]
    }
  }
  throw new Error('syntax error')
}
