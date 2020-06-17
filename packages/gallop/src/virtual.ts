import { DoAble } from './do'
import { ReactiveElement } from './component'

export class VirtualElement extends DoAble(Object) {
  el?: ReactiveElement
  slotContent?: unknown

  constructor(public tag: string, public props?: object) {
    super()
  }

  createInstance() {
    this.el = document.createElement(this.tag) as ReactiveElement
    this.props && this.el.mergeProps(this.props)
    return this.el
  }

  useSlot(view: unknown) {
    this.slotContent = view
    return this
  }
}
