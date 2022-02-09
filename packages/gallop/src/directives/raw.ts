import {
  directive,
  ensurePartType,
  createFragment,
  NodePart
} from '@gallop/gallop'

export const raw = directive((htmlStr: string) => (part) => {
  if (!ensurePartType(part, NodePart)) return
  if (htmlStr === part.value) return
  part.clear()
  const node = createFragment(htmlStr, part.location.endNode.parentNode)
  const { endNode } = part.location
  endNode.parentNode!.insertBefore(node, endNode)
  part.value = htmlStr
})
