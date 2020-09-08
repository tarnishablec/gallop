import { directive, ensurePartType } from '../directive'
import { createFragment } from '../dom'
import { NodePart } from '../part'

export const raw = directive((htmlStr: string) => (part) => {
  if (!ensurePartType(part, NodePart)) return
  if (htmlStr === part.value) return
  part.clear()
  const node = createFragment(htmlStr)
  const { endNode } = part.location
  endNode.parentNode!.insertBefore(node, endNode)
  part.value = htmlStr
})
