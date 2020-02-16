import { isText, isDocumentFragment } from './is'

export type Primitive =
  | null
  | undefined
  | boolean
  | number
  | string
  | Symbol
  | bigint

export const getBindAttrName = (front: string) =>
  front.match(/(?<=:(.+))="/)![1]

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

const div = document.createElement('div')

export const getFragmentContent = (
  val: DocumentFragment | DocumentFragment[]
): string => {
  let nest = div.cloneNode() as HTMLDivElement
  if (isDocumentFragment(val)) {
    nest.appendChild(val.cloneNode(true))
  } else {
    val.forEach(v => {
      nest.appendChild(v.cloneNode(true))
    })
  }
  return nest.innerHTML
}

export const marker = () => `{{${String(Math.random()).slice(2)}-marker}}`
