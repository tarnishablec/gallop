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
    defaultProp: eval(`(${def})`) as T
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

const hasOwn = Object.hasOwnProperty
const is = Object.is
const keys = <T>(val: T) => Object.keys(val) as Array<keyof T>

export const shallowEqual = (objA: unknown, objB: unknown) => {
  if (is(objA, objB)) return true

  if (
    typeof objA !== 'object' ||
    objA === null ||
    typeof objB !== 'object' ||
    objB === null
  ) {
    return false
  }

  const keysA = keys(objA)
  const keysB = keys(objB)

  if (keysA.length !== keysB.length) return false

  for (let i = 0; i < keysA.length; i++) {
    if (!hasOwn.call(objB, keysA[i]) || !is(objA[keysA[i]], objB[keysA[i]])) {
      return false
    }
  }

  return true
}

export const twoStrArrayCompare = (arrA: string[], arrB: string[]): boolean => {
  if (arrA.length !== arrB.length) {
    return false
  }

  return arrA.join('') === arrB.join('')
}

type DiffResult = {
  delete: number[]
  add: number[]
  move: { from: number; to: number }[]
}

export const keyListDiff = (pre: unknown[], next: unknown[]) => {
  let res: DiffResult = {
    delete: [],
    add: [],
    move: []
  }
  pre.forEach((p, index) => {
    const i = next.indexOf(p)
    if (i < 0) {
      res.delete.push(index)
    } else if (i !== index) {
      res.move.push({ from: index, to: i })
    }
  })
  next.forEach((n, index) => {
    const i = pre.indexOf(n)
    if (i < 0) {
      res.add.push(index)
    }
  })

  return res
}

export const dedup = (arr: unknown[]) => Array.from(new Set(arr))
