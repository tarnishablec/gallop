import { DoAble } from './do'
import { ReactiveElement } from './component'
import { HTMLClip } from './clip'

export class VirtualElement extends DoAble(Object) {
  el?: ReactiveElement
  slotContent?: HTMLClip

  constructor(public tag: string, public props?: object) {
    super()
  }

  createInstance() {
    this.el = document.createElement(this.tag) as ReactiveElement
    this.props && this.el.mergeProps(this.props)
    return this.el
  }

  useSlot(view: HTMLClip) {
    this.slotContent = view
    return this
  }
}
