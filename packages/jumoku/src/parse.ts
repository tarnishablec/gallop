import {
  isText,
  isFragmentClip,
  isStaticClip,
  isFragmentClipArray,
  isFunction,
  isFragmentClipOrArray
} from './is'

type ClipFlagMap = Map<number, FragmentClip | FragmentClip[]>
type FuncFlagMap = Map<number, Function>
type NormalFlagMap = Map<number, any>

export type FlagMaps = {
  clipFlagMap: ClipFlagMap
  funcFlagMap: FuncFlagMap
  normalFlagMap: NormalFlagMap
}

export type FragmentClip = {
  fragment: DocumentFragment
  _isClip: boolean
  _isStatic: boolean
} & FlagMaps

export function html(
  strs: TemplateStringsArray,
  ...vals: unknown[]
): FragmentClip {
  // console.log(vals)
  const flagMaps: FlagMaps = {
    clipFlagMap: new Map(),
    funcFlagMap: new Map(),
    normalFlagMap: new Map()
  }
  const raw = strs.reduce((acc, cur, index) => {
    return `${acc}${cur}${placeFlag(vals[index], index, flagMaps)}`
  }, '')

  let fragment = document.createRange().createContextualFragment(raw)
  drawFlags(fragment, flagMaps)
  fragment.normalize()
  let _isStatic = !vals
  const res = {
    fragment: cleanNode(fragment).cloneNode(true) as DocumentFragment,
    _isClip: true,
    _isStatic,
    ...flagMaps
  }
  console.log(res)
  return res
}

function placeFlag(val: unknown, index: number, flagMaps: FlagMaps) {
  if (!val) {
    return ''
  }
  if (isFragmentClipOrArray(val)) {
    flagMaps.clipFlagMap.set(index, val)
    return `<span id="doc-flag-${index}"></span>`
  }
  if (isFunction(val)) {
    flagMaps.funcFlagMap.set(index, val)
    // console.log(val.toString())
    return val
  } else {
    flagMaps.normalFlagMap.set(index, val)
    return val as any
  }
}

function drawFlags(fragment: DocumentFragment, flagMaps: FlagMaps) {
  flagMaps.clipFlagMap.forEach((val, key) => {
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

function cleanNode<T extends Node>(node: T): T {
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
