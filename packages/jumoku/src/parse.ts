import { isDocumentFragment, isDocumentFragmentArray, isFunction } from './is'

type DocFlagMap = Map<number, DocumentFragment | DocumentFragment[]>
type FuncFlagMap = Map<number, Function>

type FlagMaps = {
  docFlagMap: DocFlagMap
  funcFlagMap: FuncFlagMap
}

export function html(
  strs: TemplateStringsArray,
  ...vals: any[]
): DocumentFragment {
  const flagMaps: FlagMaps = {
    docFlagMap: new Map(),
    funcFlagMap: new Map()
  }
  const raw = strs.reduce((acc, cur, index) => {
    return `${acc}${cur}${placeFlag(vals[index], index, flagMaps)}`
  }, '')
  let fragment = document.createRange().createContextualFragment(raw)
  drawFlags(fragment, flagMaps)
  fragment.normalize()
  return cleanNode(fragment)
}

function placeFlag(val: any, index: number, flagMaps: FlagMaps): string {
  if (!val) {
    return ''
  }
  if (isDocumentFragment(val) || isDocumentFragmentArray(val)) {
    flagMaps.docFlagMap.set(index, val)
    return `<span id="doc-flag-${index}"></span>`
  }
  if (isFunction(val)) {
    flagMaps.funcFlagMap.set(index, val)
    return val.name
  }
  return val
}

function drawFlags(fragment: DocumentFragment, flagMaps: FlagMaps) {
  flagMaps.docFlagMap.forEach((val, key) => {
    const flag = fragment.querySelector(`span#doc-flag-${key}`)!
    if (isDocumentFragment(val)) {
      fragment.replaceChild(val, flag)
    } else if (isDocumentFragmentArray(val)) {
      val.forEach(v => {
        flag.parentNode?.insertBefore(v, flag)
      })
      flag.parentNode?.removeChild(flag)
    }
  })
}

function cleanNode<T extends Node>(node: T): T {
  let res = node.cloneNode() as T

  node.childNodes.forEach(c => {
    if (c.nodeType !== Node.TEXT_NODE) {
      res.appendChild(cleanNode(c))
    } else if (!(c as Text).wholeText.match(/^\s*$/)) {
      res.appendChild(new Text((c as Text).wholeText.trim()))
    }
  })
  return res
}
