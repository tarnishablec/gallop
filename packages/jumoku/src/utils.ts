import { isText, isDocumentFragment } from './is'

export type Primitive =
  | null
  | undefined
  | boolean
  | number
  | string
  | Symbol
  | bigint

export const cleanNode = <T extends Node>(node: T): T => {
  let res = node.cloneNode() as T

  node.childNodes.forEach(c => {
    if (!isText(c)) {
      res.appendChild(cleanNode(c))
    } else if (!/^\s*$/.test(c.wholeText)) {
      res.appendChild(new Text(c.wholeText.trim()))
    }
  })
  return res
}

export const getFragmentContent = (
  val: DocumentFragment | DocumentFragment[]
): string => {
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
