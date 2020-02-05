import { isFragmentClip, isFragmentClipArray, isFunction } from './is'

type FragFlagMap = Map<number, FragmentClip | FragmentClip[]>
type FuncFlagMap = Map<number, Function>

type FlagMaps = {
  fragFlagMap: FragFlagMap
  funcFlagMap: FuncFlagMap
}

export type FragmentClip = { fragment: DocumentFragment } & FlagMaps

export function html(strs: TemplateStringsArray, ...vals: any[]): FragmentClip {
  console.log(vals)
  const flagMaps: FlagMaps = {
    fragFlagMap: new Map(),
    funcFlagMap: new Map()
  }
  const raw = strs.reduce((acc, cur, index) => {
    return `${acc}${cur}${placeFlag(vals[index], index, flagMaps)}`
  }, '')

  let fragment = document.createRange().createContextualFragment(raw)
  drawFlags(fragment, flagMaps)
  fragment.normalize()
  return { fragment, ...flagMaps }
}

function placeFlag(val: any, index: number, flagMaps: FlagMaps): string {
  if (!val) {
    return ''
  }
  if (isFragmentClip(val) || isFragmentClipArray(val)) {
    flagMaps.fragFlagMap.set(index, val)
    return `<span id="doc-flag-${index}"></span>`
  }
  if (isFunction(val)) {
    flagMaps.funcFlagMap.set(index, val)
    return val.name
  }
  return val
}

function drawFlags(fragment: DocumentFragment, flagMaps: FlagMaps) {
  flagMaps.fragFlagMap.forEach((val, key) => {
    const flag = fragment.querySelector(`span#doc-flag-${key}`)!
    if (isFragmentClip(val)) {
      flag.parentNode?.replaceChild(val.fragment, flag)
    } else if (isFragmentClipArray(val)) {
      val.forEach(d => {
        flag.parentNode?.insertBefore(d.fragment, flag)
      })
      flag.parentNode?.removeChild(flag)
    }
  })
}

// function cleanNode<T extends Node>(node: T): T {
//   let res = node.cloneNode() as T

//   node.childNodes.forEach(c => {
//     if (c.nodeType !== Node.TEXT_NODE) {
//       res.appendChild(cleanNode(c))
//     } else if (!(c as Text).wholeText.match(/^\s*$/)) {
//       res.appendChild(new Text((c as Text).wholeText.trim()))
//     }
//   })
//   return res
// }
