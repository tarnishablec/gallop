export const createTreeWalker = (root: Node) =>
  document.createTreeWalker(root, 133)

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
  let res = []
  let temp = ''
  let canPush = true
  let blockStack = []

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
