import { HTMLClip, createPatcher, getVals } from './clip'
import { Patcher } from './patcher'
import { Obj } from './utils'
import { Looper } from './loop'
import { createProxy } from './reactive'

export type Component = (...args: any[]) => HTMLClip

type RegisterOption = {
  extend?: keyof HTMLElementTagNameMap
  Inherit?: new () => HTMLElement
  shadow?: boolean
  stable?: boolean
}

export interface ReactiveElement extends HTMLElement {
  $builder: Component
  $root: ReactiveElement | ShadowRoot
  $patcher?: Patcher

  $props: Obj

  $state?: Obj

  requestUpdate(): void
  dispatchUpdate(): void

  $emit: InstanceType<typeof EventTarget>['dispatchEvent']
  $on: InstanceType<typeof EventTarget>['addEventListener']
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
  const clazz = class extends Inherit implements ReactiveElement {
    $builder = builder
    $root = shadow ? this.attachShadow({ mode: 'open' }) : this
    $patcher?: Patcher = undefined
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
      const clip = this.$builder.call(this, this.$props)
      if (!this.$patcher) {
        this.$patcher = clip.do(createPatcher)
        this.$root.append(this.$patcher.dof)
      }
      this.$patcher.tryUpdate(clip.do(getVals))
    }

    connectedCallback() {
      this.requestUpdate()
    }
    disconnectedCallback() {}

    constructor() {
      super()
    }
  }
  customElements.define(name, clazz, { extends: extend })
}
