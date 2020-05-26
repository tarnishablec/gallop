import { isMarker } from './is'

export type Primitive =
  | null
  | undefined
  | boolean
  | number
  | string
  | symbol
  | BigInt

export type Key = Exclude<Primitive, null | undefined | boolean>

export function tryParseToString(val: unknown): string {
  if (
    val === undefined ||
    typeof val === 'string' ||
    typeof val === 'function' ||
    typeof val === 'symbol' ||
    typeof val === 'number'
  )
    return String(val)
  if (val === null) return ''
  return JSON.stringify(val)
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
  const startIndex = rawStr.indexOf(head)
  if (startIndex < 0) {
    return ['', rawStr]
  }
  let endIndex
  const stack = [0]
  for (let i = startIndex + 1; i < rawStr.length; i++) {
    if (rawStr[i] === tail) {
      stack.pop()
    } else if (rawStr[i] === head) {
      stack.push(0)
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

export function lastOf<T>(arr: T[]) {
  return arr[arr.length - 1]
}

export function isMatchedSymbol(front: string | undefined, back: string) {
  switch (back) {
    case ')':
      return front === '('
    case '}':
      return front === '{'
    case ']':
      return front === '['
    case '>':
      return front === '<'
    case '"':
      return front === '"'
    case "'":
      return front === "'"
    default:
      return false
  }
}

export function getFuncArgNames(func: Function) {
  const [funcHead] = digStringBlock(func.toString(), undefined, false)
  const arr = funcHead.replace(/(\/\*.*?\*\/)|\s/g, '')
  const res = []
  let temp = ''
  let canPush = true
  const blockStack = []

  for (let i = 0; i < arr.length; i++) {
    const isInBlock = !!blockStack.length
    const cur = arr[i]

    if (isMatchedSymbol(lastOf(blockStack), cur)) {
      blockStack.pop()
      continue
    } else if (
      ['(', ')', '[', ']', '{', '}', '<', '>', '"', "'"].includes(cur)
    ) {
      blockStack.push(cur)
    }

    if (!isInBlock) {
      if (cur === ',') {
        canPush = true
        continue
      }
      if (canPush) {
        temp += cur
        if ([',', '='].includes(arr[i + 1]) || i + 1 === arr.length) {
          res.push(temp)
          temp = ''
          canPush = false
        }
      }
    }
  }
  return res
}

export function extractProps(attr: NamedNodeMap) {
  return Array.from(attr)
    .filter((a) => /^:\S+/.test(a.name) && !isMarker(a.value))
    .reduce((acc, { name, value }) => {
      let v: string | boolean
      if (value === '') {
        v = true
      } else if (value === "''") {
        v = ''
      } else {
        v = value
      }
      Reflect.set(acc, name.slice(1), v)
      return acc
    }, {} as any)
}

const is = Object.is
function keys<T>(val: T) {
  return Object.keys(val) as Array<keyof T>
}

export function shallowEqual(objA: unknown, objB: unknown) {
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
    if (!(keysA[i] in objB) || !is(objA[keysA[i]], objB[keysA[i]])) {
      return false
    }
  }
  return true
}

export function twoStrArrayCompare(arrA: string[], arrB: string[]) {
  if (arrA.length !== arrB.length) {
    return false
  }
  return arrA.join('') === arrB.join('')
}
