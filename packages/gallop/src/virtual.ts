import { DoAble } from './do'
import { ReactiveElement } from './component'
import { HTMLClip, createClip, getVals } from './clip'

export class VirtualElement extends DoAble(Object) {
  el?: ReactiveElement
  slotContent?: HTMLClip

  constructor(public tag: string, public props?: object) {
    super()
  }

  createInstance() {
    this.el = document.createElement(this.tag) as ReactiveElement
    this.props && this.el.mergeProps(this.props)
    this.initSlot()
    return this.el
  }

  initSlot() {
    if (this.slotContent && this.el) {
      this.el.$virtualSlotClip = this.slotContent.do(createClip)
      this.el.$virtualSlotVals = this.slotContent.do(getVals)
    }
  }

  useSlot(view?: HTMLClip) {
    this.slotContent = view
    return this
  }
}
