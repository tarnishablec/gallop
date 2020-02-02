export function html(
  strs: TemplateStringsArray,
  ...vals: any[]
): DocumentFragment {
  const raw = strs.reduce((acc, cur, index) => {
    return `${acc}${cur}${vals[index] ?? ''}`
  }, '')
  let fragment = document.createRange().createContextualFragment(raw)
  fragment.normalize()
  return cleanNode(fragment)
}

export function cleanNode<T extends Node>(node: T): T {
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
