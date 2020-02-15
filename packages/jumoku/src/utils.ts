import { isText } from './is'

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
