import {
  isText,
  isFragmentClip,
  isStaticClip,
  isFragmentClipArray,
  isFunction,
  isFragmentClipOrArray,
  isNodeAttribute
} from './is'

type ClipFlagMap = Map<number, FragmentClip | FragmentClip[]>
type FuncFlagMap = Map<number, Function>
type TextFlagMap = Map<number, string>
type AttrFlagMap = Map<number, string>

export type FlagMaps = {
  clipFlagMap: ClipFlagMap
  funcFlagMap: FuncFlagMap
  textFlagMap: TextFlagMap
  attrFlagMap: AttrFlagMap
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
    textFlagMap: new Map(),
    attrFlagMap: new Map()
  }
  const raw = strs.reduce((acc, cur, index) => {
    return `${acc}${cur}${placeFlag(vals[index], index, flagMaps, cur)}`
  }, '')

  let fragment = document.createRange().createContextualFragment(raw)
  drawFlags(fragment, flagMaps)
  fragment.normalize()
  let _isStatic = vals.length === 0
  const res = {
    fragment: cleanNode(fragment).cloneNode(true) as DocumentFragment,
    _isClip: true,
    _isStatic,
    ...flagMaps
  }
  console.log({
    fragment: cleanNode(fragment).cloneNode(true) as DocumentFragment,
    _isClip: true,
    _isStatic,
    ...flagMaps
  })
  return res
}

function placeFlag(
  val: unknown,
  index: number,
  flagMaps: FlagMaps,
  front?: string
) {
  if (!val) {
    return ''
  }
  if (isFragmentClipOrArray(val)) {
    flagMaps.clipFlagMap.set(index, val)
    return `<span id="clip-flag-${index}"></span>`
  }
  if (isFunction(val)) {
    flagMaps.funcFlagMap.set(index, val)
    // console.log(val.toString())
    return val
  }
  if (isNodeAttribute(val, front!)) {
    flagMaps.textFlagMap.set(index, val.toString())
    return val as any
  }
}

function drawFlags(fragment: DocumentFragment, flagMaps: FlagMaps) {
  flagMaps.clipFlagMap.forEach((val, key) => {
    const flag = fragment.querySelector(`span#clip-flag-${key}`)!
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
