import { FragmentClip } from './parse'

function toVNode(fragment: FragmentClip) {}

interface VNode {
  sel: string
  children?: (VNode | string)[]
  _isStatic: boolean
  data?: any
  cache?: Map<any, VNode>
}
