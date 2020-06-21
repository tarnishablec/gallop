import { HTMLClip } from './clip'
import { Patcher } from './patcher'
import { Obj } from './utils'
import { Looper } from './loop'
import { createProxy } from './reactive'

type Component = (...args: any[]) => HTMLClip

type RegisterOption = {
  extend?: keyof HTMLElementTagNameMap
  Inherit?: new () => HTMLElement
  shadow?: boolean
}

export interface ReactiveElement extends HTMLElement {
  $builder: Component
  $root: ReactiveElement | ShadowRoot
  $patcher?: Patcher

  $props?: Obj
  $state?: Obj

  requestUpdate(): void
  dispatchUpdate(): void

  $emit: InstanceType<typeof HTMLElement>['dispatchEvent']
  $on: InstanceType<typeof HTMLElement>['addEventListener']
}

export function component<F extends Component>(
  name: string,
  builder: F,
  {
    shadow = true,
    extend = undefined,
    Inherit = HTMLElement
  }: RegisterOption = {}
) {
  class Clazz extends Inherit implements ReactiveElement {
    $builder = builder
    $root = shadow ? this.attachShadow({ mode: 'open' }) : this

    $props = createProxy(
      {},
      {
        onSet: () => this.requestUpdate()
      }
    )

    $emit = this.dispatchEvent
    $on = this.addEventListener

    requestUpdate() {
      Looper.enUpdateQueue(this)
    }
    dispatchUpdate() {
      this.$builder.call(this, this.$props)
    }

    connectedCallback() {
      this.requestUpdate()
    }
    disconnectedCallback() {}

    constructor() {
      super()
    }
  }
  customElements.define(name, Clazz, { extends: extend })
}
